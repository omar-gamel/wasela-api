import { InputType, Field } from "type-graphql";
import { IsString, IsOptional, Min, IsArray, ArrayMinSize, IsNumber, IsBoolean } from "class-validator";

@InputType()
export class UpdatePathInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    description?: string;

    @Field({ nullable: true })
    @Min(0)
    @IsNumber()
    @IsOptional()
    discount_price?: number;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    image?: string; 

    slug: string;

    total_price: number;
}



