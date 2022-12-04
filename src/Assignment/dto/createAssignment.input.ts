import { InputType, Field } from "type-graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateAssignmentInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    description: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    link?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    file?: string;
}

