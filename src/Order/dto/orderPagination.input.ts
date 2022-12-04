import { InputType, Field } from "type-graphql";
import { IsOptional, IsString } from "class-validator";
import { BasicPaginationInput } from "src/Share/basicPagination.input";

@InputType()
export class OrderPaginationInput extends BasicPaginationInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    userId?: string;
}

