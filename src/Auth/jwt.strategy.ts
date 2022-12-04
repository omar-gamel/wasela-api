import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as config from 'config';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET')
        })
    };

    async validate(payload) {
        const user = await this.prisma.users.findOne({
            where: { id: payload.userId },
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
        if (!user)
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

        if (!user.isEmailVerified)
            throw new HttpException('Email not verified', HttpStatus.UNAUTHORIZED);

        return user;
    };
}
