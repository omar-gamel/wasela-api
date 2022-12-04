import { ObjectType, Field } from "type-graphql";
import { User } from "src/User/models/user.model";
import { Day } from "src/Day/models/day.model";

@ObjectType()
export class UserAssignment {
    @Field()
    id: string;

    @Field(type => Day)
    day: Day;

    @Field(type => User)
    author: User;

    @Field()
    isActive: true;

    @Field({ nullable: true })
    description?: string;

    @Field(type => [String])
    files: string[];

    @Field(type => [User])
    likes: User[];

    @Field()
    appearOnSpecialWorkPage: boolean;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
