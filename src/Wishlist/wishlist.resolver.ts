import { Resolver, Mutation, Query, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { WishlistConnection } from "./models/wishlistConnection.model";
import { WishlistResponse } from "./models/wishlistResponse.model";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { Wishlist } from "./models/wishlist.model";
import { WishlistService } from "./wishlist.service";
import { Roles } from "src/Common/decorators/roles.decorator";
import { WishlistPaginationInput } from "./dto/wishlistPagination.input";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";

@Resolver(of => Wishlist)
export class WishlistResolver {
    constructor(private readonly wishlistService: WishlistService) { }

    @UseGuards(LoginGuard)
    @Mutation(returns => WishlistResponse)
    async courseAddToOrRemoveFromWishlist(@Args('courseId') courseId: string, @CurrentUser('id') userId: string) {
        return await this.wishlistService.courseAddToOrRemoveFromWishlist(courseId, userId);
    };

    @UseGuards(LoginGuard)
    @Mutation(returns => WishlistResponse)
    async pathAddToOrRemoveFromWishlist(@Args('pathId') pathId: string, @CurrentUser('id') userId: string) {
        return await this.wishlistService.pathAddToOrRemoveFromWishlist(pathId, userId);
    };

    @UseGuards(LoginGuard)
    @Query(returns => Wishlist, { nullable: true })
    async myWishlist(@CurrentUser('id') userId: string) {
        return await this.wishlistService.myWishlist(userId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Query(returns => Wishlist, { nullable: true })
    async wishlist(@Args('wishlistId') wishlistId: string) {
        return await this.wishlistService.wishlist(wishlistId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Query(returns => WishlistConnection)
    async wishlists(@Args('input') wishlistPaginationInput: WishlistPaginationInput) {
        return await this.wishlistService.wishlists(wishlistPaginationInput);
    };
}
