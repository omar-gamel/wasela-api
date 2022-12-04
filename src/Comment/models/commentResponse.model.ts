import { ObjectType, Field } from "type-graphql";
import { Comment } from "./comment.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class CommentResponse extends MutationResponse {
    @Field(type => Comment, { nullable: true })
    comment?: Comment;
}


