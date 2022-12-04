import { InputType, Field } from "type-graphql";
import { BasicPaginationInput } from "src/Share/basicPagination.input";
import { IsBoolean, IsOptional } from "class-validator";

@InputType()
export class PlaylistPaginationInput extends BasicPaginationInput {
    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}



