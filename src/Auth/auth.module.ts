import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { SlugService } from 'src/Share/slug/slug.service';
import { MailModule } from 'src/Share/mail/mail.module';
import * as config from 'config';
import { PhoneModule } from 'src/Share/phone/phone.module';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: config.get('JWT_SECRET'),
            signOptions: { expiresIn: config.get('EXPIRES_IN') },
        }),
        MailModule,
        PrismaModule,
        PhoneModule
    ],
    providers: [AuthService, AuthResolver, JwtStrategy, SlugService],
    exports: []
})
export class AuthModule { }
