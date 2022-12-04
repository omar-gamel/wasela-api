import { OrderService } from './order.service';
import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { NotificationModule } from 'src/Notification/notification.module';

@Module({
    imports: [PrismaModule, NotificationModule], providers: [OrderService, OrderResolver]
})
export class OrderModule { }
