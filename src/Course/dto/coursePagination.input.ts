import { InputType, Field, Int } from "type-graphql";
import { IsOptional, IsString, IsNotEmpty, IsBoolean, IsArray, ArrayMinSize } from "class-validator";
import { CourseReviewStatus } from "../models/course.model";
import { BasicPaginationInput, PriceRangeInput } from "src/Share/basicPagination.input";

@InputType()
export class CoursePaginationInput extends BasicPaginationInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    keyword?: string;

    @Field(type => [String], { nullable: true })
    @IsArray()
    @IsOptional()
    @ArrayMinSize(1)
    instructorsIds?: string[];

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    category?: string;

    @Field(type => CourseReviewStatus, { nullable: true })
    @IsOptional()
    status?: CourseReviewStatus;

    @Field(type => PriceRangeInput, { nullable: true })
    @IsOptional()
    priceRange?: PriceRangeInput;

    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}


