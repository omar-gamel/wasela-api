import { InputType, Field, Int } from "type-graphql";
import { IsString, IsOptional, IsNumber, IsPositive } from "class-validator";

@InputType()
export class UpdatePlaylistItemInput { 
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
    link?: string;
}

