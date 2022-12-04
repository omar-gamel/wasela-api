import { InputType, Field } from "type-graphql";
import { IsOptional, IsString, IsBoolean } from "class-validator";
import { BasicPaginationInput } from "src/Share/basicPagination.input";

@InputType()
export class CategoryPaginationInput extends BasicPaginationInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    keyword?: string;

    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}



