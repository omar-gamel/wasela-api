import { ArgsType, Field } from "type-graphql";
import { IsNotEmpty, IsString } from "class-validator";
import { CourseReviewStatus } from "../models/course.model";

@ArgsType()
export class ChangeCourseStatusArgs {
    @Field()
    @IsString()
    @IsNotEmpty()
    courseId: string

    @Field(type => CourseReviewStatus)
    @IsNotEmpty()
    status: CourseReviewStatus;
}
