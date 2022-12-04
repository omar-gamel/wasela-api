import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistResolver } from './wishlist.resolver';
import { PrismaModule } from 'src/Prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [WishlistService, WishlistResolver]
})
export class WishlistModule { }
