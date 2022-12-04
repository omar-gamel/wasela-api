import { ObjectType, Field, Int } from "type-graphql";
import { User } from "src/User/models/user.model";
import { Course } from "src/Course/models/course.model";
import { Lecture } from "src/Lecture/models/lecture.model";

@ObjectType()
export class UserCourse {
    @Field()
    id: string;

    @Field(type => User)
    user: User;

    @Field(type => Course)
    course: Course;

    @Field(type => Int)
    progress: number; 

    @Field(type => [Lecture])
    watchedLectures: Lecture[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

