import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AssignmentService } from "./assignment.service";
import { UseGuards } from "@nestjs/common";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { Roles } from "src/Common/decorators/roles.decorator";
import { AssignmentResponse } from "./models/assignmentResponse.model";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { User } from "src/User/models/user.model";
import { CreateAssignmentInput } from "./dto/createAssignment.input";
import { UpdateAssignmentInput } from "./dto/updateAssignment.input";
import { Assignment } from "./models/assignment.model";
import { Response } from "src/Share/response.model";

@Resolver(of => Assignment)
export class AssignmentResolver {
    constructor(private readonly assignmentService: AssignmentService) { }

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN', 'INSTRUCTOR')
    @Mutation(returns => AssignmentResponse)
    async addDayAssignment(
        @CurrentUser() user: User,
        @Args('dayId') dayId: string,
        @Args('input') createAssignmentInput: CreateAssignmentInput,
    ) {
        return await this.assignmentService.addDayAssignment(dayId, createAssignmentInput, user);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN', 'INSTRUCTOR')
    @Mutation(returns => AssignmentResponse)
    async updateDayAssignment(
        @CurrentUser() user: User,
        @Args('dayId') dayId: string,
        @Args('assignmentId') assignmentId: string,
        @Args('input') updateAssignmentInput: UpdateAssignmentInput
    ) {
        return await this.assignmentService.updateDayAssignment(dayId, assignmentId, updateAssignmentInput, user);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN', 'INSTRUCTOR')
    @Mutation(returns => Response)
    async deleteDayAssignment(
        @CurrentUser() user: User,
        @Args('dayId') dayId: string,
        @Args('assignmentId') assignmentId: string,

    ) {
        return await this.assignmentService.deleteDayAssignment(dayId, assignmentId, user);
    };
}