import { ObjectType, Field, Int, registerEnumType } from "type-graphql";
import { OrderItem } from "./OrderItem.model";
import { User } from "src/User/models/user.model";

@ObjectType()
export class Order {
    @Field()
    id: string;

    @Field(type => Int)
    orderNumber: number;

    @Field(type => User)
    user: User;

    @Field()
    subTotalPrice: number;

    @Field()
    totalPrice: number;

    @Field({ nullable: true })
    fullName?: String;

    @Field({ nullable: true })
    country?: String;

    @Field(type => [OrderItem])
    items: OrderItem[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field()
    paymentMethod: PaymentMethods;
};

export enum PaymentMethods {
    CREDIT_CARD = 'CREDIT_CARD',
    BANK_ACCOUNT = 'BANK_ACCOUNT',
    PAYPAL = 'PAYPAL',
    WESTERN_UNION = 'WESTERN_UNION',
    AMAN = 'AMAN',
    VODAFONE_CASH = 'VODAFONE_CASH',
    MOBI_CASH = 'MOBI_CASH'
};
registerEnumType(PaymentMethods, { name: 'PaymentMethods' });

 