import { InputType, Field, Int } from "type-graphql";
import { CourseType, CourseLevel } from "../models/course.model";
import { IsOptional, IsPositive, IsNumber, IsString, IsNotEmpty, Min, IsArray, ArrayMinSize } from "class-validator";
import { SoftwareUsedInput } from "./createCourse.input";

@InputType()
export class UpdateCourseInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    description?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    image?: string;

    @Field(type => Int, { nullable: true })
    @IsNumber()
    @IsOptional()
    totalHours?: number;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    prerequisites?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    requirements?: string;

    @Field(type => [String], { nullable: true })
    @IsArray()
    @IsOptional()
    @ArrayMinSize(1)
    deliverables?: string[];

    @Field({ nullable: true })
    @Min(0)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @Field(type => [SoftwareUsedInput], { nullable: true })
    @IsArray()
    @IsOptional()
    @ArrayMinSize(1)
    softwareUsed?: SoftwareUsedInput[];

    @Field(type => CourseLevel, { nullable: true })
    @IsOptional()
    level?: CourseLevel;

    @Field(type => CourseType, { nullable: true })
    @IsOptional()
    type?: CourseType;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    promoVideo?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    category?: string;

    slug: string;
}


