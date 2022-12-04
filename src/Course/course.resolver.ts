import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { Roles } from "src/Common/decorators/roles.decorator";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { CourseService } from "./course.service";
import { ChangeCourseStatusArgs } from "./dto/changeCourseStatus.args";
import { CoursePaginationInput } from "./dto/coursePagination.input";
import { CreateCourseInput } from "./dto/createCourse.input";
import { CreateCourseDayInput } from "./dto/createCourseDay.input";
import { UpdateCourseInput } from "./dto/updateCourse.input";
import { Course } from "./models/course.model";
import { CourseConnection } from "./models/courseConnection.model";
import { CourseResponse } from "./models/courseResponse.model";
import { User } from "src/User/models/user.model";

@Resolver(of => Course)
export class CourseResolver {
    constructor(private readonly courseService: CourseService) { }

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN', 'INSTRUCTOR')
    @Mutation(returns => CourseResponse)
    async createCourse(
        @Args('courseInput') courseInput: CreateCourseInput,
        @Args({ name: 'daysInput', type: () => [CreateCourseDayInput] }) daysInput: CreateCourseDayInput[],
        @CurrentUser() user: User
    ) {
        return await this.courseService.createCourse(courseInput, daysInput, user);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN', 'INSTRUCTOR')
    @Mutation(returns => CourseResponse)
    async updateCourseInfo(
        @Args('courseInput') updateCourseInput: UpdateCourseInput,
        @Args('courseId') courseId: string,
        @CurrentUser() user: User
    ) {
        return await this.courseService.updateCourseInfo(courseId, updateCourseInput, user);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => CourseResponse)
    async changeCourseStatus(@Args() changeCourseStatusArgs: ChangeCourseStatusArgs) {
        return await this.courseService.changeCourseStatus(changeCourseStatusArgs);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => CourseResponse)
    async toggleCourseActivation(@Args('courseId') courseId: string) {
        return this.courseService.toggleCourseActivation(courseId);
    };

    @Query(returns => Course, { nullable: true })
    async course(@Args('slug') slug: string) {
        return this.courseService.course(slug);
    };

    @Query(returns => CourseConnection)
    async courses(@Args('input') coursePaginationInput: CoursePaginationInput) {
        return this.courseService.courses(coursePaginationInput);
    };
}

