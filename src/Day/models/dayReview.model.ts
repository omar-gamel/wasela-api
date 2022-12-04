import { ObjectType, Field, ID, Int } from "type-graphql";
import { User } from "src/User/models/user.model";

@ObjectType()
export class DayReview {
    @Field()
    id: string;

    @Field(type => User)
    author: User;

    @Field()
    dayRate: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
