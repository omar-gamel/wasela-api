import { Field, ObjectType } from "type-graphql";
import { Day } from "src/Day/models/day.model";

@ObjectType()
export class Assignment {
    @Field()
    id: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    link?: String

    @Field({ nullable: true })
    file?: string;

    @Field(type => Day)
    day: Day;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

