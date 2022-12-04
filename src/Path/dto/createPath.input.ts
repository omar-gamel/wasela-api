import { InputType, Field } from "type-graphql";
import { IsString, IsNotEmpty, IsNumber, IsBoolean, Min, IsArray, ArrayMinSize } from "class-validator";

@InputType()
export class CreatePathInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    description: string;

    @Field()
    @Min(0)
    @IsNumber()
    @IsNotEmpty()
    discount_price: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    image: string;

    @Field(type => [String])
    @IsArray()
    @ArrayMinSize(1)
    courses: string[];

    @Field({ nullable: true })
    @IsBoolean()
    @IsNotEmpty()
    isActive?: boolean;

    slug: string;

    total_price: number;
}

