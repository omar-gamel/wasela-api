import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { LectureService } from "./lecture.service";
import { Lecture } from "./models/lecture.model";
import { UseGuards } from "@nestjs/common";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { Roles } from "src/Common/decorators/roles.decorator";
import { LectureResponse } from "./models/lectureResponse.model";
import { CreateLectureInput } from "./dto/createLecture.input";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { User } from "src/User/models/user.model";
import { UpdateLectureInput } from "./dto/updateLecture.input";
import { Response } from "src/Share/response.model";

@Resolver(of => Lecture)
export class LectureResolver {
    constructor(private readonly lectureService: LectureService) { }

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN', 'INSTRUCTOR')
    @Mutation(returns => LectureResponse)
    async addDayLecture(
        @CurrentUser() user: User,
        @Args('dayId') dayId: string,
        @Args('input') createLectureInput: CreateLectureInput,
    ) {
        return await this.lectureService.addDayLecture(dayId, createLectureInput, user);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN', 'INSTRUCTOR')
    @Mutation(returns => LectureResponse)
    async updateDayLecture(
        @CurrentUser() user: User,
        @Args('dayId') dayId: string,
        @Args('lectureId') lectureId: string,
        @Args('input') updateLectureInput: UpdateLectureInput
    ) {
        return await this.lectureService.updateDayLecture(dayId, lectureId, updateLectureInput, user);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN', 'INSTRUCTOR')
    @Mutation(returns => Response)
    async deleteDayLecture(
        @CurrentUser() user: User,
        @Args('dayId') dayId: string,
        @Args('lectureId') lectureId: string,

    ) {
        return await this.lectureService.deleteDayLecture(dayId, lectureId, user);
    };
}