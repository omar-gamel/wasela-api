import { ObjectType, Field } from "type-graphql";
import { Cart } from "./cart.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class CartResponse extends MutationResponse {
    @Field(type => Cart, { nullable: true })
    cart?: Cart;
}
