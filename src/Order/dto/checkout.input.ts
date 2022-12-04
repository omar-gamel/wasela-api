import { InputType, Field } from "type-graphql";
import { IsOptional, IsNotEmpty, IsString } from "class-validator";
import { PaymentMethods } from "../models/order.model";

@InputType()
export class CheckoutInput {
    @Field(type => PaymentMethods)
    @IsNotEmpty()
    paymentMethod: PaymentMethods;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    fullName?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    country?: string;
};
 