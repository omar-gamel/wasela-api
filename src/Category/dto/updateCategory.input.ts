import { InputType, Field } from "type-graphql";
import { IsBoolean, IsString, IsOptional, IsNotEmpty } from "class-validator";

@InputType()
export class UpdateCategoryInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    description?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    icon?: string;

    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    slug: string;
}
