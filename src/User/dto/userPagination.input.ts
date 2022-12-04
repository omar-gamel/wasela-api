import { Field, InputType } from "type-graphql";
import { BasicPaginationInput } from "src/Share/basicPagination.input";
import { Role } from '../models/user.model';
import { IsString, IsOptional, IsBoolean } from "class-validator";

@InputType()
export class UserPaginationInput extends BasicPaginationInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    keyword?: string;

    @Field(type => Role, { nullable: true })
    @IsOptional()
    role?: Role;

    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
};