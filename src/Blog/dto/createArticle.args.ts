import { Field, ArgsType } from "type-graphql";
import { IsNotEmpty, IsString } from "class-validator";

@ArgsType()
export class CreateArticleArgs {
    @Field()
    @IsString()
    @IsNotEmpty()
    sectionId: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    image: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    text: string;
}


