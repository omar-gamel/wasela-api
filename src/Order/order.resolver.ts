import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { LoginGuard } from "src/Common/guards/login.guard";
import { OrderResponse } from "./models/orderResponse.model";
import { OrderService } from "./order.service";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { Roles } from "src/Common/decorators/roles.decorator";
import { Order } from "./models/order.model";
import { BasicPaginationInput } from "src/Share/basicPagination.input";
import { OrderPaginationInput } from "./dto/orderPagination.input";
import { OrderConnection } from "./models/orderConnection.model";
import { CheckoutInput } from "./dto/checkout.input";

@Resolver(of => Order)
export class OrderResolver {
    constructor(private readonly orderService: OrderService) { }

    @UseGuards(LoginGuard)
    @Mutation(returns => OrderResponse)
    async checkout(@Args('input') checkoutInput: CheckoutInput, @CurrentUser('id') userId: string) {
        return await this.orderService.checkout(checkoutInput, userId);
    }; 

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Query(returns => Order, { nullable: true })
    async order(@Args('orderId') orderId: string) {
        return await this.orderService.order(orderId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Query(returns => OrderConnection)
    async orders(@Args('input') orderPaginationInput: OrderPaginationInput) {
        return await this.orderService.orders(orderPaginationInput);
    };

    @UseGuards(LoginGuard)
    @Query(returns => Order, { nullable: true })
    async myOrder(@Args('orderId') orderId: string, @CurrentUser('id') userId: string) {
        return await this.orderService.myOrder(orderId, userId);
    };

    @UseGuards(LoginGuard)
    @Query(returns => [Order])
    async myOrders(@Args('input') basicPaginationInput: BasicPaginationInput, @CurrentUser('id') userId: string) {
        return await this.orderService.myOrders(basicPaginationInput, userId);
    };
}
