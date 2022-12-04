import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PubSubEngine } from 'type-graphql';
import { NotificationInput } from './dto/notification.input';

@Injectable()
export class NotificationService {
    constructor(@Inject('PUB_SUB') private pubSub: PubSubEngine, private readonly prisma: PrismaService) { }

    async fireNewNotification(input: NotificationInput) {
        try {
            let recipients = [];
            input.to.forEach(id => recipients.push({ user: { connect: { id } } }));

            const notification = await this.prisma.notifications.create({
                data: {
                    message: input.message,
                    type: input.type,
                    to: {
                        create: [...recipients]
                    }
                },
                include: { model: true, to: { include: { user: true } } }
            });
            if (input.model)
                await this.prisma.notificationModels.create({
                    data: {
                        ...input.model,
                        notifications: { connect: { id: notification.id } },
                    }
                });

            this.pubSub.publish('newNotification', { 'to': notification.to, 'newNotification': notification });
            return notification;
        } catch (error) {
            throw error;
        }
    };

    async updateUserNotificationStatus(notificationId: string, userId: string) {
        try {
            let notification = await this.myNotification(notificationId, userId);
            if (!notification)
                throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);

            const index = notification.to.findIndex(recipient => recipient.user.id.toString() === userId.toString());
            notification = await this.prisma.notifications.update({
                where: { id: notificationId },
                data: {
                    to: {
                        update: {
                            where: { id: notification.to[index].id },
                            data: { isSeen: true }
                        }
                    }
                },
                include: { model: true, to: { include: { user: true } } }
            });
            return { code: 200, message: 'Notification status updated successfully', success: true, notification };
        } catch (error) {
            throw error;
        }
    };

    async myNotifications(userId: string) {
        return await this.prisma.notifications.findMany({
            where: { to: { some: { user: { id: userId } } } },
            include: { model: true, to: { include: { user: true } } }
        });
    };

    async myNotification(notificationId: string, userId: string) {
        const notifications = await this.myNotifications(userId);
        return notifications.find(notification => notification.id.toString() === notificationId.toString());
    };
}
