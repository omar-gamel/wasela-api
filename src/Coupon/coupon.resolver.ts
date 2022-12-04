import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { Roles } from "src/Common/decorators/roles.decorator";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { LoginGuard } from "src/Common/guards/login.guard";
import { CouponResponse } from "./models/couponResponse";
import { CouponService } from "./coupon.service";
import { Coupon } from "./models/coupon.model";
import { CreateCouponInput } from "./dto/createCoupon.input";
import { CouponPaginationInput } from "./dto/couponPagination.input";

@Resolver(of => Coupon)
export class CouponResolver {
    constructor(private readonly couponService: CouponService) { }

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => CouponResponse)
    async createCoupon(@Args('input') createCouponInput: CreateCouponInput, @CurrentUser('id') userId: string) {
        return await this.couponService.createCoupon(createCouponInput, userId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => CouponResponse)
    async toggleCouponActivation(@Args('couponId') couponId: string) {
        return await this.couponService.toggleCouponActivation(couponId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Query(returns => Coupon, { nullable: true })
    async coupon(@Args('couponId') couponId: string) {
        return await this.couponService.coupon(couponId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Query(returns => [Coupon])
    async coupons(@Args('input') couponPaginationInput: CouponPaginationInput) {
        return await this.couponService.coupons(couponPaginationInput);
    };
}
