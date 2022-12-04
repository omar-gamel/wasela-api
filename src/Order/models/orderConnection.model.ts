import { Field, Int, ObjectType } from "type-graphql";
import { Order } from "./order.model";

@ObjectType()
export class OrderConnection {
    @Field(type => Int)
    totalCount: number;

    @Field(type => [Order])
    orders: Order[];
}
