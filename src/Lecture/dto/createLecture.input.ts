import { InputType, Int, Field } from "type-graphql";
import { IsPositive, IsString, IsNotEmpty, IsNumber } from "class-validator";

@InputType()
export class CreateLectureInput {
    @Field(type => Int)
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    rank: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    link: string
}
