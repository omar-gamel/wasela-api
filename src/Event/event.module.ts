import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { SlugService } from 'src/Share/slug/slug.service';
import { NotificationModule } from 'src/Notification/notification.module';

@Module({
    imports: [PrismaModule, NotificationModule],
    providers: [
        EventService,
        EventResolver,
        SlugService
    ]
})
export class EventModule { }
