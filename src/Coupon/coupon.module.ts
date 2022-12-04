import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponResolver } from './coupon.resolver';
import { PrismaModule } from 'src/Prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [CouponService, CouponResolver]
})
export class CouponModule {}
