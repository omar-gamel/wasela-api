import { IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { Gender } from '../models/user.model';

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    phone?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    avatar?: string;

    @Field(type => Int, { nullable: true })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    age?: number;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    country?: string;

    @Field(type => Gender)
    @IsOptional()
    gender?: Gender;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    about?: string;

    slug?: string
}

