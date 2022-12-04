import { InputType, Field, Int } from "type-graphql";
import { CreatePlaylistItemInput } from "./createplaylistItem.input";
import { IsNotEmpty, IsString, IsArray, ArrayMinSize, ValidateNested } from "class-validator";

@InputType()
export class CreatePlaylistInput {
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

    @Field(type => [CreatePlaylistItemInput]) 
    @IsArray()
    @ArrayMinSize(1)
    items: CreatePlaylistItemInput[];
}





