import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { SlugService } from 'src/Share/slug/slug.service';

@Module({
    imports: [PrismaModule],
    providers: [UserService, UserResolver, SlugService]
})
export class UserModule {}
