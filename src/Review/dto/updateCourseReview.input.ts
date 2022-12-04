import { InputType, Field } from "type-graphql";
import { IsString, MinLength, MaxLength, Min, IsNumber, Max, IsOptional  } from "class-validator";

@InputType()
export class UpdateCourseReviewInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    @MinLength(10)
    @MaxLength(100)
    text?: string;

    @Field({ nullable: true })
    @Min(0)
    @Max(5)
    @IsNumber()
    @IsOptional()
    instructorRate?: number;

    @Field({ nullable: true })
    @Min(0)
    @Max(5)
    @IsNumber()
    @IsOptional()
    courseRate?: number;
}
