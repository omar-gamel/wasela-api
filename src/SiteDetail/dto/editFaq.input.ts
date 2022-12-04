import { Field, InputType, Int } from 'type-graphql';
import { IsNotEmpty, IsPositive, IsOptional, IsNumber, IsString } from 'class-validator';

@InputType()
export class EditFaqInput {
    @Field(type => Int, { nullable: true })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    rank?: number;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    question?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    answer?: string;
}
