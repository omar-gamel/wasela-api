import { Field, ArgsType } from "type-graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@ArgsType()
export class UpdateSectionArgs {
    @Field()
    @IsString()
    @IsNotEmpty()
    sectionId: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    title?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    description?: string;
}

