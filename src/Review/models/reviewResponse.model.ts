import { ObjectType, Field } from "type-graphql";
import { MutationResponse } from "src/Share/mutationResponse.model";
import { Review } from "./review.model";

@ObjectType({ implements: MutationResponse })
export class ReviewResponse extends MutationResponse {
    @Field(type => Review, { nullable: true })
    review?: Review;
}
