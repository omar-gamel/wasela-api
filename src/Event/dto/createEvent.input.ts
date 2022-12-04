import { Field, InputType } from "type-graphql";
import { IsNotEmpty, IsString, IsDate } from "class-validator";

@InputType()
export class CreateEventInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    description: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    image: string;

    @Field()
    @IsDate()
    @IsNotEmpty()
    startDate: Date;

    @Field()
    @IsDate()
    @IsNotEmpty()
    endDate: Date;

    @Field()
    @IsString()
    @IsNotEmpty()
    place: string;
}


