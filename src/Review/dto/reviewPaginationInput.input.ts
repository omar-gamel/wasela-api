import { Field, InputType } from "type-graphql";
import { IsString, IsOptional, IsBoolean } from "class-validator";
import { BasicPaginationInput } from "src/Share/basicPagination.input";

@InputType()
export class ReviewPaginationInput extends BasicPaginationInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    courseId?: string;

    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    isReported?: boolean;
};