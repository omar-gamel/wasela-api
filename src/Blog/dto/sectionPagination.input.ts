import { InputType, Field } from "type-graphql";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { BasicPaginationInput } from "src/Share/basicPagination.input";

@InputType()
export class SectionPaginationInput extends BasicPaginationInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    keyword?: string;

    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}



