import { Field, ArgsType } from "type-graphql";
import { IsNotEmpty, IsString, MinLength, IsOptional } from "class-validator";

@ArgsType()
export class UpdateCommentArgs {
    @Field()
    @IsString()
    @IsNotEmpty()
    commentId: string;

    @Field({ nullable: true })
    @IsString()
    @MinLength(10)
    @IsOptional()
    text?: string;
}


