import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { Roles } from "src/Common/decorators/roles.decorator";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { BasicPaginationInput } from "src/Share/basicPagination.input";
import { PurchasePaginationInput } from "./dto/purchasePagination.input";
import { Purchase } from "./models/purchase.model";
import { PurchaseConnection } from "./models/purchaseConnection.model";
import { PurchaseService } from "./purchase.service";

@Resolver(of => Purchase)
export class PurchaseResolver {
    constructor(private readonly purchaseService: PurchaseService) { }

    @UseGuards(LoginGuard)
    @Query(returns => [Purchase])
    async myPurchases(@Args('input') basicPaginationInput: BasicPaginationInput, @CurrentUser('id') userId: string) {
        return await this.purchaseService.myPurchases(basicPaginationInput, userId);
    };

    @UseGuards(LoginGuard)
    @Query(returns => Purchase, { nullable: true })
    async myPurchase(@Args('purchaseId') purchaseId: string, @CurrentUser('id') userId: string) {
        return await this.purchaseService.myPurchase(purchaseId, userId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Query(returns => PurchaseConnection)
    async purchases(@Args('input') purchasePaginationInput: PurchasePaginationInput) {
        return await this.purchaseService.purchases(purchasePaginationInput);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Query(returns => Purchase, { nullable: true })
    async purchase(@Args('purchaseId') purchaseId: string) {
        return await this.purchaseService.purchase(purchaseId);
    };
}
