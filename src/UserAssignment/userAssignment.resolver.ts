import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { UserAssignmentService } from "./userAssignment.service";
import { UserAssignment } from "./models/userAssignment.model";
import { LoginGuard } from "src/Common/guards/login.guard";
import { User } from "src/User/models/user.model";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { Roles } from "src/Common/decorators/roles.decorator";
import { CreateUserAssignmentArgs } from "./dto/createUserAssignment.args";
import { UserAssignmentResponse } from "./models/userAssignmentResponse.model";
import { UserAssignmentPaginationInput } from "./dto/userAssignmentPagination.input";

@Resolver(of => UserAssignment)
export class UserAssignmentResolver {
    constructor(private readonly userAssignmentService: UserAssignmentService) { }

    @UseGuards(LoginGuard)
    @Mutation(returns => UserAssignmentResponse)
    async addUserAssignmentAswer(
        @Args('dayId') dayId: string,
        @Args() createUserAssignmentArgs: CreateUserAssignmentArgs,
        @CurrentUser() user: User
    ) {
        return await this.userAssignmentService.addUserAssignmentAswer(dayId, createUserAssignmentArgs, user);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN', 'INSTRUCTOR')
    @Mutation(returns => UserAssignmentResponse)
    async toggleAppearUserAssignmentOnSpecialWorkPage(@Args('userAssignmentId') userAssignmentId: string, @CurrentUser() user: User) {
        return await this.userAssignmentService.toggleAppearUserAssignmentOnSpecialWorkPage(userAssignmentId, user);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => UserAssignmentResponse)
    async toggleUserAssignmentActivation(@Args('userAssignmentId') userAssignmentId: string) {
        return await this.userAssignmentService.toggleUserAssignmentActivation(userAssignmentId);
    };

    @UseGuards(LoginGuard)
    @Mutation(returns => UserAssignmentResponse)
    async addUserAssignmentLikeAction(@Args('userAssignmentId') userAssignmentId: string, @CurrentUser() user: User) {
        return await this.userAssignmentService.addUserAssignmentLikeAction(userAssignmentId, user);
    };

    @UseGuards(LoginGuard)
    @Query(returns => [UserAssignment])
    async myAssignmentAnswers(@CurrentUser('id') userId: string) {
        return await this.userAssignmentService.myAssignmentAnswers(userId);
    };

    @Query(returns => [UserAssignment])
    async dayAssignmentsAnswers(@Args('input') userAssignmentPaginationInput: UserAssignmentPaginationInput) {
        return await this.userAssignmentService.dayAssignmentsAnswers(userAssignmentPaginationInput);
    };
}
