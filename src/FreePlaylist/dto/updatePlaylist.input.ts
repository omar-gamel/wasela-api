import { InputType, Field } from "type-graphql";
import { IsString, IsOptional } from "class-validator";

@InputType()
export class UpdatePlaylistInput { 
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

    slug: string;
}

