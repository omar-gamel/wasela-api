import { Resolver, Subscription, Query, Args, Mutation } from "@nestjs/graphql";
import { Inject, UseGuards } from "@nestjs/common";
import { PubSubEngine } from 'graphql-subscriptions';
import { LoginGuard } from "src/Common/guards/login.guard";
import { Notification } from "./models/notification.model";
import { NotificationService } from "./notification.service";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { NotificationResponse } from "./models/notificationResponse.model";

@Resolver()
export class NotificationResolver {
    constructor(@Inject('PUB_SUB') private pubSub: PubSubEngine, private readonly notificationService: NotificationService) { }
    @UseGuards(LoginGuard)
    @Mutation(returns => NotificationResponse)
    async updateUserNotificationStatus(@Args('notificationId') notificationId: string, @CurrentUser('id') userId: string) {
        return await this.notificationService.updateUserNotificationStatus(notificationId, userId);
    };

    @Subscription(returns => Notification, {
        filter: (payload: { newNotification: Notification }, variables: { userId: string }) => {
            return payload.newNotification.to.some(to => to.user.id.toString() === variables.userId.toString());
        }
    })
    newNotification(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator('newNotification');
    };

    @UseGuards(LoginGuard)
    @Query(returns => [Notification])
    async myNotifications(@CurrentUser('id') userId: string) {
        return await this.notificationService.myNotifications(userId);
    };

    @UseGuards(LoginGuard)
    @Query(returns => Notification, { nullable: true })
    async myNotification(@Args('notificationId') notificationId: string, @CurrentUser('id') userId: string) {
        return await this.notificationService.myNotification(notificationId, userId);
    };
}
