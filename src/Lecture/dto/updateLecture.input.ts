import { InputType, Int, Field } from "type-graphql";
import { IsPositive, IsString, IsOptional, IsNumber } from "class-validator";

@InputType()
export class UpdateLectureInput {
    @Field(type => Int, { nullable: true })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    rank?: number;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    title?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    link?: string
}
