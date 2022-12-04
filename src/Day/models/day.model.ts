import { ObjectType, Field, ID, Int } from "type-graphql";
import { DayReview } from "./dayReview.model";
import { Course } from "src/Course/models/course.model";
import { Comment } from "src/Comment/models/comment.model";
import { Lecture } from "src/Lecture/models/lecture.model";
import { Assignment } from "src/Assignment/models/assignment.model";
import { User } from "src/User/models/user.model";

@ObjectType()
export class Day {
    @Field()
    id: string;

    @Field(type => Int)
    rank: number;

    @Field()
    title: string;

    @Field()
    slug: string;

    @Field()
    description: string;

    @Field(type => Course)
    course: Course;

    @Field()
    isActive: boolean;

    @Field(type => [Lecture])
    lectures: Lecture[];

    @Field(type => [Comment])
    comments: Comment[];

    @Field(type => [DayReview])
    reviews: DayReview[];

    @Field(type => [String], { nullable: true })
    attachments?: string[];

    @Field(type => [Assignment], { nullable: true })
    assignments?: Assignment[];

    @Field(type => [User])
    availableFor: User[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}





