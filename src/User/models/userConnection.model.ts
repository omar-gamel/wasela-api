import { ObjectType, Field, Int } from "type-graphql";
import { User } from "./user.model";

@ObjectType()
export class UserConnection {
    @Field(type => Int)
    totalCount: number;

    @Field(type => [User])
    users: User[];
}
