import { Field, ArgsType } from "type-graphql";
import { IsNotEmpty, IsString } from "class-validator";

@ArgsType()
export class CreateSectionArgs {
    @Field()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    description: string;
}
