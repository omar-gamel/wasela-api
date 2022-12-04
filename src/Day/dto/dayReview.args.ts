import { Field, ArgsType, Int } from "type-graphql";
import { IsNotEmpty, Min, Max, IsString, IsNumber } from "class-validator";

@ArgsType()
export class DayReviewArgs {
    @Field()
    @IsString()
    @IsNotEmpty()
    dayId: string;

    @Field()
    @Min(0)
    @Max(5)
    @IsNumber()
    @IsNotEmpty()
    dayRate: number;
}


