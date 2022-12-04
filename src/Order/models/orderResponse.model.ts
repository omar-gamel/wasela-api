import { ObjectType, Field } from "type-graphql";
import { Order } from "./order.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class OrderResponse extends MutationResponse {
    @Field(type => Order, { nullable: true })
    order?: Order;
}


