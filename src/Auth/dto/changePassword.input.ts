import { Field, InputType } from 'type-graphql';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class ChangePasswordInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @Field()
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    newPassword: string;
}
