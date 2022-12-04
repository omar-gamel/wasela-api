import { ObjectType, Field, registerEnumType, Int } from "type-graphql";
import { CartItem } from "./cartItem.model";
import { User } from "src/User/models/user.model";

@ObjectType()
export class Cart {
    @Field()
    id: string;

    @Field(type => User)
    user: User;

    @Field(type => Int)
    totoalQty: number;

    @Field()
    totalPrice: string;

    @Field(type => [CartItem])
    items: CartItem[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
};

export enum ItemType {
    COURSE = 'COURSE',
    PATH = 'PATH'
};
registerEnumType(ItemType, { name: 'ItemType' });


