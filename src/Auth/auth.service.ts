import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as config from 'config';
import { ResetPasswordInput } from './dto/resetPassword.input';
import { SocialAccountInput } from './dto/socialAccount.input';
import { PrismaService } from 'src/Prisma/prisma.service';
import { RegisterInput } from './dto/register.input';
import { LoginArgs } from './dto/login.args';
import { VerifyUserArgs } from './dto/verifyUser.args';
import { SlugService } from 'src/Share/slug/slug.service';
import { MailService } from 'src/Share/mail/mail.service';
import { PhoneService } from 'src/Share/phone/phone.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly slugService: SlugService,
        private readonly mailService: MailService,
        private readonly sms : PhoneService
    ) { }

    private async generateAuthToken(id: string): Promise<string> {
        return await this.jwtService.sign({ userId: id });
    };

    private async findUserByEmail(email: string) {
        return await this.prisma.users.findOne({ where: { email: email.toLocaleLowerCase() } })
    };

    async register(input: RegisterInput) {
        try {
            let user = await this.findUserByEmail(input.email);
            if (user)
                throw new HttpException('E-Mail address already exists!', HttpStatus.BAD_REQUEST);

            const hashedPw = await bcrypt.hash(input.password, 12);
            input.slug = await this.slugService.generateSlug(input.name);
            user = await this.prisma.users.create({
                data: {
                    ...input,
                    password: hashedPw,
                    email: input.email.toLowerCase()
                }
            });
            const token = await this.generateAuthToken(user.id);
            await this.sendConfirmationMail(input.email);
            return { code: 201, message: 'User created successfully', success: true, token, user };
        } catch (error) {
            throw error;
        }
    };

    async createInstructor(input: RegisterInput) {
        try {
            let user = await this.findUserByEmail(input.email);
            if (user)
                throw new HttpException('E-Mail address already exists!', HttpStatus.BAD_REQUEST);

            const hashedPw = await bcrypt.hash(input.password, 12);
            input.slug = await this.slugService.generateSlug(input.name);
            user = await this.prisma.users.create({
                data: {
                    ...input,
                    password: hashedPw,
                    roles: 'INSTRUCTOR',
                    email: input.email.toLowerCase()
                }
            });
            const token = await this.generateAuthToken(user.id);
            await this.sendConfirmationMail(input.email);
            return { code: 201, message: 'User created successfully', success: true, token, user };
        } catch (error) {
            throw error;
        }
    };

    async login(args: LoginArgs) {
        try {
            const user = await this.findUserByEmail(args.email);
            if (!user)
                throw new HttpException(`No user found for email: ${args.email}`, HttpStatus.NOT_FOUND)

            const isEqual = await bcrypt.compare(args.password, user.password);
            if (!isEqual)
                throw new HttpException('Wrong password!', HttpStatus.BAD_REQUEST);

            const token = await this.generateAuthToken(user.id);
            return { code: 200, message: 'User logged in successfully', success: true, token, user };
        } catch (error) {
            throw error;
        }
    };

    async sendConfirmationMail(email: string) {
        try {
            const user = await this.findUserByEmail(email);
            if (!user)
                throw new HttpException(`No user found for email: ${email}`, HttpStatus.NOT_FOUND);

            const token = await randomBytes(20).toString('hex');
            const verificationToken = bcrypt.hashSync(token, 12);
            const VerificationTokenExpiry = Date.now() + 3600000; // 1 hour
            await this.mailService.sendEmail({
                from: config.get('MAIL.ADMIN_EMAIL'),
                to: email,
                subject: 'Email confirmation',
                html: `<a href="${config.get('MAIL.FRONTEND_URL')}?verificationToken=${token}&email=${email}">Confirm</a>`
            });
            const userMailVerification = await this.prisma.userMailVerifications.findOne({ where: { email: email.toLowerCase() } });
            if (!userMailVerification) {
                await this.prisma.userMailVerifications.create({
                    data: {
                        email: email.toLowerCase(),
                        verificationToken: verificationToken,
                        verificationTokenExpiry: new Date(VerificationTokenExpiry)
                    }
                });
            } else {
                await this.prisma.userMailVerifications.update({
                    where: { email: email.toLowerCase() },
                    data: { verificationToken: verificationToken, verificationTokenExpiry: new Date(VerificationTokenExpiry) }
                });
            }
            return { code: 200, message: 'Confirmation mail sent', success: true };
        } catch (error) {
            throw error;
        }
    };

    async verifyUser(args: VerifyUserArgs) {
        try {
            const verificationEntity = await this.prisma.userMailVerifications.findOne({ where: { email: args.email.toLowerCase() } });
            if (!verificationEntity || !verificationEntity.verificationToken)
                throw new HttpException('User can not be verified, resend verification mail', HttpStatus.BAD_REQUEST);

            if (verificationEntity.verificationTokenExpiry < new Date(Date.now()))
                throw new HttpException('Token is expired', HttpStatus.BAD_REQUEST);

            const isMatch = bcrypt.compareSync(args.token, verificationEntity.verificationToken);
            if (!isMatch)
                throw new HttpException(`User can not be verified with token: ${args.token}`, HttpStatus.BAD_REQUEST);

            const user = await this.prisma.users.update({
                where: { email: verificationEntity.email },
                data: { isEmailVerified: true }
            });
            await this.prisma.userMailVerifications.update({
                where: { email: verificationEntity.email },
                data: { verificationToken: null }
            });
            const token = await this.generateAuthToken(user.id);
            return { code: 200, message: 'User created successfully', success: true, token, user };
        } catch (error) {
            throw error;
        }
    };

    async sendRestPassword(email: string) {
        try {
            const user = await this.findUserByEmail(email);
            if (!user)
                throw new HttpException(`No user found for email: ${email}`, HttpStatus.NOT_FOUND);

            const token = await randomBytes(20).toString('hex');
            const resetToken = bcrypt.hashSync(token, 12);
            const resetTokenExpiry = Date.now() + 3600000; // 1 hour
            await this.mailService.sendEmail({
                from: config.get('MAIL.ADMIN_EMAIL'),
                to: email,
                subject: 'Email confirmation',
                html: `<a href="${config.get('MAIL.FRONTEND_URL')}?verificationToken=${token}&email=${user.email}">Reset</a>`
            });
            const resetPassword = await this.prisma.userResetPasswords.findOne({ where: { email: email.toLocaleLowerCase() } });
            if (!resetPassword) {
                await this.prisma.userResetPasswords.create({
                    data: {
                        email: user.email,
                        resetToken,
                        resetTokenExpiry: new Date(resetTokenExpiry)
                    }
                });
            } else {
                await this.prisma.userResetPasswords.update({
                    where: { email: user.email },
                    data: { resetToken: resetToken, resetTokenExpiry: new Date(resetTokenExpiry) }
                });
            }
            return { code: 200, message: 'Please check your email', success: true };
        } catch (error) {
            throw error;
        }
    };

    async resetPassword(input: ResetPasswordInput) {
        try {
            const restEntity = await this.prisma.userResetPasswords.findOne({
                where: { email: input.email.toLowerCase() }
            });
            if (!restEntity || !restEntity.resetToken)
                throw new HttpException('Can not reset password, resend verification mail', HttpStatus.NOT_FOUND);

            if (restEntity.resetTokenExpiry < new Date(Date.now()))
                throw new HttpException('Token is expired', HttpStatus.BAD_REQUEST);

            const isMatch = bcrypt.compareSync(input.token, restEntity.resetToken);
            if (!isMatch)
                throw new HttpException('Invalid verification token', HttpStatus.NOT_FOUND);

            const hashedPw = await bcrypt.hash(input.password, 12);
            const user = await this.prisma.users.update({
                where: { email: restEntity.email },
                data: { password: hashedPw }
            });

            await this.prisma.userResetPasswords.update({
                where: { email: restEntity.email },
                data: { resetToken: null, resetTokenExpiry: null }
            });
            const token = this.generateAuthToken(user.id);
            return { code: 200, message: 'Password reset successfully', success: true, user, token };
        } catch (error) {
            throw error;
        }
    };

    async socialLoginOrRegister(input: SocialAccountInput) {
        try {
            let user = await this.prisma.users.findOne({
                where: { email: input.email.toLowerCase() },
                include: { socialAccounts: true }
            });
            const exists = user ? user.socialAccounts.find(account => account.providerId === input.providerId) : null;
            // register
            if (!exists) {
                if (!user) { // Didn't register before
                    const reserved = await this.prisma.socialAccounts.findOne({ where: { providerId: input.providerId } });
                    if (reserved)
                        throw new HttpException('This social account is used', HttpStatus.BAD_REQUEST);
                        
                    user = await this.prisma.users.create({
                        data: {
                            email: input.email,
                            name: input.username,
                            isEmailVerified: true,
                            socialAccounts: {
                                create: [{ providerId: input.providerId, providerName: input.providerName }]
                            },
                            slug: await this.slugService.generateSlug(input.username),
                        },
                        include: { socialAccounts: true }
                    });
                } else {  // Register before but not have this account - Push to its accounts
                    const reserved = await this.prisma.socialAccounts.findOne({ where: { providerId: input.providerId } });
                    if (reserved)
                        throw new HttpException('This social account is used', HttpStatus.BAD_REQUEST);

                    user = await this.prisma.users.update({
                        where: { email: input.email.toLowerCase() },
                        data: {
                            socialAccounts: {
                                create: [{ providerId: input.providerId, providerName: input.providerName }]
                            }
                        },
                        include: { socialAccounts: true }
                    })
                }
            }
            // Login before and have this account - Login
            const token = await this.generateAuthToken(user.id);
            return { code: 201, message: 'User logged in successfully', success: true, token, user };
        } catch (error) {
            throw error;
        }
    };
}
