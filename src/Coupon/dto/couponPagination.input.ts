import { InputType, Field, Int } from "type-graphql";
import { BasicPaginationInput } from "src/Share/basicPagination.input";
import { IsOptional, IsNotEmpty, IsString, IsBoolean } from "class-validator";

@InputType()
export class CouponPaginationInput extends BasicPaginationInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    user?: string;
    
    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean; 
}

