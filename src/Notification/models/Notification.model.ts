import { ObjectType, Field, registerEnumType } from "type-graphql";
import { NotificationRecipient } from "./notificationRecipient.model";
import { NotificationModel } from "./notificationModel.model";

@ObjectType()
export class Notification {
    @Field()
    id: string;

    @Field()
    message: string;

    @Field(type => NotificationType)
    type: NotificationType;

    @Field(type => [NotificationRecipient])
    to: NotificationRecipient[];

    @Field(type => [NotificationModel], { nullable: true })
    models?: NotificationModel[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
};

export enum NotificationType {
    EVENT_ALARM = 'EVENT_ALARM',
    NEW_COURSE_SUBMITTED = 'NEW_COURSE_SUBMITTED', 
    OFFLINE_ORDER_SUBMITTED = 'OFFLINE_ORDER_SUBMITTED',
    PURCHASE = 'PURCHASE',
    REVIEW_REPORTED = 'REVIEW_REPORTED',
    COMMENT_REPORTED = 'COMMENT_REPORTED',
};
registerEnumType(NotificationType, { name: 'NotificationType' });










