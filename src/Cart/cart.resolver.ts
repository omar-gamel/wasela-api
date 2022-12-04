import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { Cart } from "./models/cart.model";
import { CartService } from "./cart.service";
import { AddToCartArgs } from "./dto/addToCart.args";
import { LoginGuard } from "src/Common/guards/login.guard";
import { CartResponse } from "./models/cartResponse.model";
import { Response } from "src/Share/response.model";

@Resolver(of => Cart)
export class CartResolver {
    constructor(private readonly cartService: CartService) { }

    @UseGuards(LoginGuard)
    @Mutation(returns => CartResponse)
    async addToCart(@Args() addToCartArgs: AddToCartArgs, @CurrentUser('id') userId: string) {
        return await this.cartService.addToCart(addToCartArgs, userId);
    };

    @UseGuards(LoginGuard)
    @Mutation(returns => CartResponse)
    async removeFromCart(@Args('itemId') itemId: string, @CurrentUser('id') userId: string) {
        return await this.cartService.removeFromCart(itemId, userId);
    };

    @UseGuards(LoginGuard)
    @Mutation(returns => Response)
    async clearCart(@CurrentUser('id') userId: string) {
        return await this.cartService.clearCart(userId);
    };

    @UseGuards(LoginGuard)
    @Mutation(returns => CartResponse)
    async applyCoupon(@Args('code') code: string, @CurrentUser('id') userId: string) {
        return await this.cartService.applyCoupon(code, userId);
    };

    @UseGuards(LoginGuard)
    @Query(returns => Cart, { nullable: true })
    async myCart(@CurrentUser('id') userId: string) {
        return await this.cartService.myCart(userId);
    };
}
