import { Resolver, Query } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { WalletService } from "./wallet.service";
import { Wallet } from "./wallet.model";
import { User } from "src/User/models/user.model";
import { Roles } from "src/Common/decorators/roles.decorator";

@Resolver(of => Wallet)
export class WalletResolver {
    constructor(private readonly walletService: WalletService) { }

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('INSTRUCTOR')
    @Query(returns => Wallet, { nullable: true })
    async myWallet(@CurrentUser() user: User) {
        return await this.walletService.myWallet(user.id);
    };
}