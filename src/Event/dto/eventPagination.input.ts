import { InputType, Field } from "type-graphql";
import { BasicPaginationInput } from "src/Share/basicPagination.input";
import { IsNotEmpty, IsOptional, IsBoolean } from "class-validator";

@InputType()
export class EventPaginationInput extends BasicPaginationInput {
    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

