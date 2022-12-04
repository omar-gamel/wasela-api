import { InputType, Field, Int } from "type-graphql";
import { IsNotEmpty, IsPositive, IsOptional, MinLength, IsString, IsArray, ArrayMinSize } from "class-validator";

@InputType()
export class CreateDayInput {
    @Field(type => Int)
    @IsPositive()
    @IsNotEmpty()
    rank: number;

    @Field()
    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    title: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    description: string;

    @Field(type => [String], { nullable: true })
    @IsArray()
    @IsOptional()
    @ArrayMinSize(1)
    attachments?: string[];

    slug: string
}







