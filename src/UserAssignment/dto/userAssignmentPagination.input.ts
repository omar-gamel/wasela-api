import { InputType, Field } from "type-graphql";
import { IsOptional } from "class-validator";
import { BasicPaginationInput } from "src/Share/basicPagination.input";

@InputType()
export class UserAssignmentPaginationInput extends BasicPaginationInput {
    @Field({ nullable: true })
    @IsOptional()
    dayId?: string;

    @Field({ nullable: true })
    @IsOptional()
    appearOnSpecialWorkPage?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    isActive?: boolean;
}



