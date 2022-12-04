import { Field, InputType } from "type-graphql";
import { IsOptional, IsNotEmpty, IsString } from "class-validator";
import { BasicPaginationInput } from "src/Share/basicPagination.input";

@InputType()
export class WishlistPaginationInput extends BasicPaginationInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    userId?: string;
}