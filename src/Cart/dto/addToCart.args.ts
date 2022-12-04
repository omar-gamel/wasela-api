import { Field, ArgsType } from "type-graphql";
import { ItemType } from "../models/cart.model";
import { IsNotEmpty, IsString } from "class-validator";

@ArgsType()
export class AddToCartArgs {
    @Field()
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @Field(type => ItemType)
    @IsNotEmpty()
    itemType: ItemType;
}
