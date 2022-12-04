import { Field, ArgsType } from 'type-graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class VerifyUserArgs {
    @Field()
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    token: string;
}
