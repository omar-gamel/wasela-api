import { Field, InputType, Int } from 'type-graphql';
import { IsNotEmpty, IsPositive, IsString, IsNumber } from 'class-validator';

@InputType()
export class AddFaqInput {
    @Field(type => Int)
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    rank: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    question: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    answer: string;
}
