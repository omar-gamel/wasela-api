import { Field, Int, ObjectType } from "type-graphql";
import { Course } from "./course.model";

@ObjectType()
export class CourseConnection {
    @Field(type => Int)
    totalCount: number;

    @Field(type => [Course])
    courses: Course[];
}

