import { Field, ArgsType } from "type-graphql";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

@ArgsType()
export class CreateCommentArgs {
    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    text: string;
}


