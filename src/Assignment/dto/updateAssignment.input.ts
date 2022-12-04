import { InputType, Field } from "type-graphql";
import { IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateAssignmentInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    description?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    link?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    file?: string;
}

