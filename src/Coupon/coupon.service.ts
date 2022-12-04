import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as couponCode from 'coupon-code';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CreateCouponInput } from './dto/createCoupon.input';
import { CouponPaginationInput } from './dto/couponPagination.input';

@Injectable()
export class CouponService {
    constructor(private readonly prisma: PrismaService) { }

    async createCoupon(input: CreateCouponInput, userId: string) {
        try {
            let courses_id = [];
            let paths_id = [];
            if (input.courses && input.courses.length) {
                const courses = await this.prisma.courses.findMany({ where: { id: { in: input.courses } } });
                if (input.type === 'COURSES' && !courses.length)
                    throw new HttpException('Invalid courses input', HttpStatus.BAD_REQUEST);

                courses.forEach(course => courses_id.push({ id: course.id }));
            }
            if (input.paths && input.paths.length) {
                const paths = await this.prisma.paths.findMany({ where: { id: { in: input.paths } } });
                if (input.type === 'PATHS' && !paths.length)
                    throw new HttpException('Invalid paths input', HttpStatus.BAD_REQUEST);

                paths.forEach(path => paths_id.push({ id: path.id }))
            }
            if (input.isPercent && input.amount > 100)
                throw new HttpException('Invalid amount input', HttpStatus.BAD_REQUEST);

            if (!input.code)
                input.code = couponCode.generate({ parts: 4 });

            const coupon = await this.prisma.coupons.create({
                data: {
                    ...input,
                    code: input.code,
                    startDate: new Date(input.startDate),
                    endDate: new Date(input.endDate),
                    user: { connect: { id: userId } },
                    courses: { connect: courses_id },
                    paths: { connect: paths_id }
                },
                include: { user: true, courses: true, paths: true }
            });
            return { code: 201, message: 'Coupon created successfully', success: true, coupon };
        } catch (error) {
            throw error;
        }
    };

    async toggleCouponActivation(couponId: string) {
        try {
            let coupon = await this.prisma.coupons.findOne({ where: { id: couponId } });
            if (!coupon)
                throw new HttpException('Coupon not found', HttpStatus.NOT_FOUND);

            coupon = await this.prisma.coupons.update({
                where: { id: couponId },
                data: { isActive: !coupon.isActive },
                include: { user: true, courses: true, paths: true }
            });
            return { code: 200, message: 'Coupon status changed', success: true, coupon };
        } catch (error) {
            throw error;
        }
    };

    async coupon(couponId: string) {
        return await this.prisma.coupons.findOne({
            where: { id: couponId },
            include: { user: true, courses: true, paths: true }
        });
    };

    async coupons(input: CouponPaginationInput) {
        return await this.prisma.coupons.findMany({
            where: {
                AND: [
                    { user: { id: { equals: input.user } } },
                    { isActive: { equals: input.isActive } }
                ]
            },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: { user: true, courses: true, paths: true }
        });
    };
}
