import { InputType, Field, Int } from "type-graphql";
import { IsNotEmpty, IsString, IsNumber, IsPositive } from "class-validator";

@InputType()
export class CreatePlaylistItemInput {
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
    link: string;
}




