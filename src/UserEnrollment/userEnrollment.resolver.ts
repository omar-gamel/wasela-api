import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { LoginGuard } from "src/Common/guards/login.guard";
import { UserCourse } from "./models/userCourse.model";
import { UserPath } from "./models/userPath.model";
import { UserPathResponse } from "./models/userPathResponse.model";
import { UserEnrollmentService } from "./userEnrollment.service";
import { UserCourseResponse } from "./models/userCourseResponse.model";

@Resolver()
export class UserEnrollmentResolver {
    constructor(private readonly userEnrollmentService: UserEnrollmentService) { }

    @UseGuards(LoginGuard)
    @Mutation(returns => UserCourseResponse)
    async updateCourseProgress(@Args('courseId') courseId: string, @Args('lectureId') lectureId: string, @CurrentUser('id') userId: string) {
        return await this.userEnrollmentService.updateCourseProgress(courseId, lectureId, userId);
    };

    @UseGuards(LoginGuard)
    @Mutation(returns => UserPathResponse)
    async updatePathProgress(
        @Args('pathId') pathId: string,
        @Args('courseId') courseId: string,
        @Args('lectureId') lectureId: string,
        @CurrentUser('id') userId: string

    ) {
        return await this.userEnrollmentService.updatePathProgress(pathId, courseId, lectureId, userId);
    };

    @UseGuards(LoginGuard)
    @Query(returns => [UserCourse])
    async myCourses(@CurrentUser('id') userId: string) {
        return await this.userEnrollmentService.myCourses(userId);
    };

    @UseGuards(LoginGuard)
    @Query(returns => [UserPath])
    async myPaths(@CurrentUser('id') userId: string) {
        return await this.userEnrollmentService.myPaths(userId);
    };
}
