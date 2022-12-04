import { Field, InputType } from 'type-graphql';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class ResetPasswordInput {
    @Field()
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @Field()
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    token: string;
}
