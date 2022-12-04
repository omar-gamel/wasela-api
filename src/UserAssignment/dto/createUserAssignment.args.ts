import { ArgsType, Field } from "type-graphql";
import { IsArray, ValidateNested, ArrayMinSize, IsNotEmpty, IsOptional, IsString } from "class-validator";

@ArgsType()
export class CreateUserAssignmentArgs {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    description?: string;

    @Field(type => [String])
    @IsArray()
    @IsNotEmpty({ each: true })
    @ArrayMinSize(1)
    @ValidateNested({ each: true, message: 'File path should be not empty' })
    files: string[];
}

