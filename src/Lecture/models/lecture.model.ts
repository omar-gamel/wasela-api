import { Field, ObjectType, Int } from "type-graphql";
import { Day } from "src/Day/models/day.model";

@ObjectType()
export class Lecture {
    @Field()
    id: string;

    @Field(type => Int)
    rank: number;

    @Field()
    title: string;

    @Field()
    link: String;

    @Field(type => Day)
    day: Day;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
