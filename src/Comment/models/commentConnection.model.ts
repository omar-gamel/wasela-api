import { Field, Int, ObjectType } from "type-graphql";
import { Comment } from "./comment.model";

@ObjectType()
export class CommentConnection {
    @Field(type => [Comment])
    comments: Comment[];

    @Field(type => Int)
    totalCount: number;
}
