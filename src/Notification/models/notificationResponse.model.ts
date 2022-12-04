import { ObjectType, Field } from "type-graphql";
import { Notification } from "./notification.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class NotificationResponse extends MutationResponse {
    @Field(type => Notification)
    notification: Notification;
}
