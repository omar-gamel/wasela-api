import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordInput } from 'src/Auth/dto/changePassword.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { SlugService } from 'src/Share/slug/slug.service';
import { User } from './models/user.model';
import { PrismaService } from 'src/Prisma/prisma.service';
import { UserPaginationInput } from './dto/userPagination.input';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService, private readonly slugService: SlugService) { }


    async updateUser(input: UpdateUserInput, userId: string) {
        try {
            if (input.name)
                input.slug = await this.slugService.generateSlug(input.name);

            const user = await this.prisma.users.update({
                where: { id: userId },
                data: { ...input },
                include: {
                    wishlist: true,
                    cart: true,
                    wallet: true,
                    orders: true,
                    purchases: true,
                    userCourses: true,
                    userPaths: true,
                    reviews: true,
                    events: true,
                    socialAccounts: true
                }
            });
            return { code: 201, message: 'User update successfully', success: true, user };
        } catch (error) {
            throw error;
        }
    };

    async changePassword(input: ChangePasswordInput, user: User) {
        try {
            const isEqual = await bcrypt.compare(input.oldPassword, user.password);
            if (!isEqual)
                throw new HttpException('Wrong old password!', HttpStatus.BAD_REQUEST);

            const hashedPw = await bcrypt.hash(input.newPassword, 12);
            const updatedUser = await this.prisma.users.update({
                where: { id: user.id },
                data: { password: hashedPw },
                include: {
                    wishlist: true,
                    cart: true,
                    wallet: true,
                    orders: true,
                    purchases: true,
                    userCourses: true,
                    userPaths: true,
                    reviews: true,
                    events: true,
                    socialAccounts: true
                }
            });
            return { code: 200, message: 'Password changed successfully', success: true, user: updatedUser };
        } catch (error) {
            throw error;
        }
    };

    async toggleUserActivation(userId: string) {
        try {
            let user = await this.prisma.users.findOne({ where: { id: userId } });
            if (!user)
                throw new NotFoundException(`User not found with id: ${userId}`);

            user = await this.prisma.users.update({
                where: { id: userId },
                data: { isActive: !user.isActive },
                include: {
                    wishlist: true,
                    cart: true,
                    wallet: true,
                    orders: true,
                    purchases: true,
                    userCourses: true,
                    userPaths: true,
                    reviews: true,
                    events: true,
                    socialAccounts: true
                }
            });
            return { code: 200, message: 'User activation changed', success: true, user };
        } catch (error) {
            throw error;
        }
    };

    async users(input: UserPaginationInput) {
        const users = await this.prisma.users.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { name: input.keyword },
                            { email: input.keyword },
                        ]
                    },
                    { isActive: { equals: input.isActive } },
                    { roles: { equals: input.role } }
                ]
            },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: {
                wishlist: true,
                cart: true,
                wallet: true,
                orders: true,
                purchases: true,
                userCourses: true,
                userPaths: true,
                reviews: true,
                events: true,
                socialAccounts: true
            }
        });
        const count = users.length;
        return { totalCount: count, users };
    };

    async user(slug: string) {
        return await this.prisma.users.findOne({
            where: { slug },
            include: {
                wishlist: true,
                cart: true,
                wallet: true,
                orders: true,
                purchases: true,
                userCourses: true,
                userPaths: true,
                reviews: true,
                events: true,
                socialAccounts: true
            }
        });
    };
}

