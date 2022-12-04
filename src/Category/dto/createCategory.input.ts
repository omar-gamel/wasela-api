import { InputType, Field } from "type-graphql";
import { IsBoolean, IsString, IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export class CreateCategoryInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    description: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    icon: string;

    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    slug: string;
}

