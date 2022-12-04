import { InputType, Field, Int } from "type-graphql";
import { IsOptional, IsNotEmpty, IsPositive, IsDate, Min, IsNumber, IsArray, ArrayMinSize, IsString, IsBoolean } from "class-validator";
import { CouponAppliedType } from "../models/coupon.model";

@InputType()
export class CreateCouponInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    code?: string;

    @Field()
    @IsBoolean()
    @IsNotEmpty()
    isPercent: boolean;

    @Field()
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    amount: number;

    @Field()
    @IsDate()
    @IsNotEmpty()
    startDate: Date;

    @Field()
    @IsDate()
    @IsNotEmpty()
    endDate: Date;

    @Field(type => [String], { nullable: true })
    @IsArray()
    @IsOptional()
    @ArrayMinSize(1)
    courses?: string[];

    @Field(type => [String], { nullable: true })
    @IsArray()
    @IsOptional()
    @ArrayMinSize(1)
    paths?: string[];

    @Field(type => Int)
    @Min(1)
    @IsNumber()
    @IsPositive()
    original_noUse: number;

    @Field(type => CouponAppliedType)
    @IsNotEmpty()
    type: CouponAppliedType;
}


