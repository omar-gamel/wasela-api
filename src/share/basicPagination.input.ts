import { Field, Int, registerEnumType, InputType } from "type-graphql";
import { Max, IsString, IsOptional, IsNumber, IsPositive } from "class-validator";

@InputType()
export class BasicPaginationInput {
    @Field(type => Int, { defaultValue: 50 })
    @Max(100)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    first?: number;

    @Field(type => Int, { nullable: true })
    @IsPositive()
    @IsOptional()
    skip?: number

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    after?: string

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    before?: string;

    @Field(type => OrderBy, { defaultValue: 'asc' })
    @IsOptional()
    orderBy?: OrderBy;
};

@InputType()
export class PriceRangeInput {
    @Field()
    min: number;

    @Field()
    max: number;
};

export enum OrderBy {
    ASC = 'asc', DESC = 'desc'
};

registerEnumType(OrderBy, { name: 'OrderBy' });
