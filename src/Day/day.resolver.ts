import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Roles } from "src/Common/decorators/roles.decorator";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { User } from "src/User/models/user.model";
import { DayService } from "./day.service";
import { DayResponse } from "./models/DayResponse.model";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { Day } from "./models/day.model";
import { CreateDayInput } from "./dto/createDay.input";
import { UpdateDayInput } from "./dto/updateDay.input";
import { DayReviewArgs } from "./dto/dayReview.args";
import { CreateLectureInput } from "src/Lecture/dto/createLecture.input";
import { CreateAssignmentInput } from "src/Assignment/dto/createAssignment.input";

@Resolver(of => Day)
export class DayResolver {
    constructor(private readonly dayService: DayService) { }

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN', 'INSTRUCTOR')
    @Mutation(returns => DayResponse)
    async addDay(
        @Args('dayInput') dayInput: CreateDayInput,
        @Args({ name: 'lecturesInput', type: () => [CreateLectureInput] }) lecturesInput: CreateLectureInput[],
        @Args({ name: 'assignmentsInput', type: () => [CreateAssignmentInput], nullable: true }) assignmentsInput: CreateAssignmentInput[],
        @Args('courseId') courseId: string,
        @CurrentUser() user: User
    ) {
        return await this.dayService.addDay(courseId, dayInput, lecturesInput, assignmentsInput, user);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN', 'INSTRUCTOR')
    @Mutation(returns => DayResponse)
    async updateDayInfo(
        @Args('dayId') dayId: string,
        @Args('input') input: UpdateDayInput,
        @CurrentUser() user: User
    ) {
        return await this.dayService.updateDayInfo(dayId, input, user);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => DayResponse)
    async toggleDayActivation(@Args('dayId') dayId: string) {
        return await this.dayService.toggleDayActivation(dayId);
    };

    @UseGuards(LoginGuard)
    @Mutation(returns => DayResponse)
    async addOrUpdateDayReview(@Args() dayReviewArgs: DayReviewArgs, @CurrentUser('id') userId: string) {
        return await this.dayService.addOrUpdateDayReview(dayReviewArgs, userId);
    };

    @Query(returns => Day, { nullable: true })
    async day(@Args('slug') slug: string) {
        return await this.dayService.day(slug);
    };
}
