import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { PubSubModule } from 'src/Share/pubsub/pubsub.module';

@Module({
    imports: [PrismaModule, PubSubModule],
    providers: [
        NotificationService,
        NotificationResolver
    ],
    exports: [PubSubModule, NotificationService]
})
export class NotificationModule { }
