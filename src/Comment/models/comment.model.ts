import { Field, ObjectType, Int } from "type-graphql";
import { User } from "src/User/models/user.model";

@ObjectType()
export class Comment {
    @Field()
    id: string;

    @Field(type => User)
    author: User;

    @Field()
    text: string;

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
