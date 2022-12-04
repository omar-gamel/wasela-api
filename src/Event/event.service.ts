import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CreateEventInput } from './dto/createEvent.input';
import { EventPaginationInput } from './dto/eventPagination.input';
import { NotificationService } from 'src/Notification/notification.service';
import { NotificationType } from 'src/Notification/models/notification.model';
import { SlugService } from 'src/Share/slug/slug.service';
import * as cron from 'node-cron';
import * as moment from 'moment';

@Injectable()
export class EventService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly slugService: SlugService,
        private readonly notificationService: NotificationService
    ) { }

    private async findEvent(id: string) {
        return await this.prisma.events.findOne({ where: { id }, include: { interested: true } });
    };

    async addEvent(input: CreateEventInput) {
        try {
            const event = await this.prisma.events.create({
                data: {
                    ...input,
                    startDate: new Date(input.startDate),
                    endDate: new Date(input.endDate),
                    slug: await this.slugService.generateSlug(input.title)
                },
                include: { interested: true }
            });
            const task = cron.schedule('* 1 * * *', async () => {
                const today = new Date(Date.now());
                const diff = moment(event.startDate).diff(today, 'days');
                if (diff < 0) {
                    task.stop();
                }
                if (diff === 0) {
                    const findEvent = await this.findEvent(event.id);
                    const recipients = [];
                    findEvent.interested.forEach(i => recipients.push(i.id));

                    await this.notificationService.fireNewNotification({
                        message: ' نذكرك بان هناك حدث اليوم ',
                        to: recipients,
                        model: { name: 'events', slug: event.slug },
                        type: NotificationType.EVENT_ALARM
                    });
                    task.stop();
                }
            });
            task.start();
            return { code: 201, message: 'Event created successfully', success: true, event };
        } catch (error) {
            throw error;
        }
    };

    async eventRememberMe(eventId: string, userId: string) {
        try {
            let event = await this.findEvent(eventId);
            if (!event)
                throw new HttpException('Event not found', HttpStatus.NOT_FOUND)

            event = await this.prisma.events.update({
                where: { id: eventId },
                data: { interested: { connect: { id: userId } } },
                include: { interested: true }
            });
            return { code: 201, message: 'Event alarm created successfully', success: true, event };
        } catch (error) {
            throw error;
        }
    };

    async toggleEventActivation(eventId: string) {
        try {
            let event = await this.findEvent(eventId);
            if (!event)
                throw new HttpException('Event not found', HttpStatus.NOT_FOUND);

            event = await this.prisma.events.update({
                where: { id: eventId },
                data: { isActive: !event.isActive },
                include: { interested: true }
            });
            return { code: 200, message: 'Event status changed', success: true, event };
        } catch (error) {
            throw error;
        }
    };

    async events(input: EventPaginationInput) {
        return await this.prisma.events.findMany({
            where: { isActive: input.isActive },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: { interested: true }
        });
    };

    async event(slug: string) {
        return await this.prisma.events.findOne({ where: { slug }, include: { interested: true } });
    };
}
