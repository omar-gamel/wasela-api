import { InputType, Field } from "type-graphql";
import { IsOptional, IsPositive, IsString, IsArray, ArrayMinSize } from "class-validator";

@InputType()
export class UpdateDayInput {
    @Field({ nullable: true })
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
    description?: string; 

    slug: string;
}
