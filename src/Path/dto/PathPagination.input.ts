import { InputType, Field } from "type-graphql";
import { BasicPaginationInput, PriceRangeInput } from "src/Share/basicPagination.input";
import { IsOptional, IsString, IsBoolean } from "class-validator";

@InputType()
export class PathPaginationInput extends BasicPaginationInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    keyword?: string;

    @Field(type => PriceRangeInput, { nullable: true })
    @IsOptional()
    priceRange?: PriceRangeInput;

    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

