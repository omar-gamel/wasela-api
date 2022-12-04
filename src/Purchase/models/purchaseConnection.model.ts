import { Field, Int, ObjectType } from "type-graphql";
import { Purchase } from "./purchase.model";
 
@ObjectType()
export class PurchaseConnection {
    @Field(type => Int)
    totalCount: number;

    @Field(type => [Purchase])
    purchases: Purchase[];
}
