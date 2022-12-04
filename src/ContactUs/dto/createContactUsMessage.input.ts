import { InputType, Field } from "type-graphql";
import {  IsNotEmpty, IsString, MinLength, IsEmail } from "class-validator";

@InputType()
export class CreateContactUsMessageInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    phone: string;

    @Field()
    @IsString()
    @MinLength(10)
    @IsNotEmpty()
    message: string;
}
