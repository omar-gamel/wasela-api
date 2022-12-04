import { InputType, Field } from "type-graphql";
import { IsNotEmpty, IsString, IsArray, ArrayMinSize, IsOptional } from "class-validator";
import { NotificationType } from "../models/notification.model";
import { NotificationModelInput } from "./notificationModel.input";

@InputType()
export class NotificationInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    message: string;

    @Field(type => [String])
    @IsArray()
    @ArrayMinSize(1)
    to: string[];

    @Field(type => NotificationModelInput, { nullable: true })
    @IsOptional()
    model?: NotificationModelInput;

    @Field(type => NotificationType)
    @IsNotEmpty()
    type: NotificationType;
}


