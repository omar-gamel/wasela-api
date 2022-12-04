import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { UseGuards, UsePipes } from "@nestjs/common";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { ChangePasswordInput } from "src/Auth/dto/changePassword.input";
import { UserPaginationInput } from "./dto/userPagination.input";
import { LoginGuard } from "src/Common/guards/login.guard";
import { UserResponse } from "./models/userResponse.model";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { UpdateUserInput } from "./dto/updateUser.input";
import { UserService } from "./user.service";
import { User } from "./models/user.model";
import { Roles } from "src/Common/decorators/roles.decorator";
import { UserConnection } from "./models/userConnection.model";
import { PhoneNumberValidationPipe } from "src/Common/pipes/phoneNumberValidation.pipe";

@Resolver(of => User)
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @UsePipes(PhoneNumberValidationPipe)
    @UseGuards(LoginGuard)
    @Mutation(returns => UserResponse)
    async updateUser(@Args('input') updateUserInput: UpdateUserInput, @CurrentUser('id') userId: string) {
        return await this.userService.updateUser(updateUserInput, userId);
    };

    @UseGuards(LoginGuard)
    @Mutation(returns => UserResponse)
    async changePassword(@Args('input') changePasswordInput: ChangePasswordInput, @CurrentUser() user: User) {
        return await this.userService.changePassword(changePasswordInput, user)
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => UserResponse)
    async toggleUserActivation(@Args('userId') userId: string) {
        return await this.userService.toggleUserActivation(userId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Query(returns => UserConnection)
    async users(@Args('input') userPaginationInput: UserPaginationInput) {
        return await this.userService.users(userPaginationInput);
    };

    @Query(returns => User, { nullable: true })
    async user(@Args('slug') slug: string) {
        return await this.userService.user(slug);
    };

    @UseGuards(LoginGuard)
    @Query(returns => User, { nullable: true })
    async currentUser(@CurrentUser() user) {
        return user;
    };
}
