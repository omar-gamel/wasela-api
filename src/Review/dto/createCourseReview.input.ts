import { InputType, Field } from "type-graphql";
import { IsNotEmpty, MinLength, MaxLength, Min, Max, IsString, IsNumber } from "class-validator";

@InputType()
export class CreateCourseReviewInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    courseId: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(100)
    text: string;

    @Field()
    @Min(0)
    @Max(5)
    @IsNumber()
    @IsNotEmpty()
    instructorRate: number;

    @Field()
    @Min(0)
    @Max(5)
    @IsNumber()
    @IsNotEmpty()
    courseRate: number;
}


