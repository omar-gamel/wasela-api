import { ObjectType, Field } from "type-graphql";
import { Wishlist } from "./wishlist.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class WishlistResponse extends MutationResponse {
    @Field(type => Wishlist, { nullable: true })
    wishlist?: Wishlist;
}
