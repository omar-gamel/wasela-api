import { InputType, Field } from "type-graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class NotificationModelInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    slug: string;
}


