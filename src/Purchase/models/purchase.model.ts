import { ObjectType, Field } from "type-graphql"; 
import { User } from "src/User/models/user.model";
import { PurchaseItem } from "./purchaseItem.model";
import { PaymentMethods } from "src/Order/models/order.model";

@ObjectType()
export class Purchase {
    @Field()
    id: string;

    @Field()
    price: number;

    @Field(type => User)
    user: User;

    @Field(type => PurchaseItem)
    item: PurchaseItem;

    @Field(type => PaymentMethods)
    paymentMethod: PaymentMethods;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

