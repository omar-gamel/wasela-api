import { ObjectType, Field, Float } from "type-graphql";
import { User } from "src/User/models/user.model";
import { Course } from "src/Course/models/course.model";

@ObjectType()
export class Review {
    @Field()
    id: string;

    @Field()
    author: User;

    @Field()
    course: Course;

    @Field()
    text: string;

    @Field()
    instructorRate: number;

    @Field()
    courseRate: number;

    @Field()
    isActive: boolean;

    @Field()
    isReported: boolean;

    @Field(type => [User])
    reporters: User[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
