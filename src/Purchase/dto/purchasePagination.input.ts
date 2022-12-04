import { InputType, Field } from "type-graphql";
import { BasicPaginationInput } from "src/Share/basicPagination.input";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export class PurchasePaginationInput extends BasicPaginationInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    userId?: string;
};

