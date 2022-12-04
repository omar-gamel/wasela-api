import { InputType, Field, Int } from "type-graphql";
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsPositive, IsArray, ArrayMinSize } from "class-validator";
import { CourseType, CourseLevel } from "../models/course.model";
import { CourseReviewStatus } from "../models/course.model";

@InputType()
export class CreateCourseInput {
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
    image: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    promoVideo: string;

    @Field(type => Int)
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    totalHours: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    prerequisites: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    requirements: string;

    @Field(type => [String])
    @IsArray()
    @IsOptional()
    @ArrayMinSize(1)
    deliverables: string[];

    @Field()
    @Min(0)
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @Field(type => [SoftwareUsedInput])
    @IsArray()
    @ArrayMinSize(1)
    softwareUsed: SoftwareUsedInput[];

    @Field(type => CourseLevel)
    @IsNotEmpty()
    level: CourseLevel;

    @Field(type => CourseType)
    @IsNotEmpty()
    type: CourseType;

    @Field()
    @IsString()
    @IsNotEmpty()
    category: string;

    @Field(type => String, { nullable: true })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    instructor?: string;

    status: CourseReviewStatus;

};

@InputType()
export class SoftwareUsedInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    icon: string;
};


