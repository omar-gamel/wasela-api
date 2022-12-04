import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { NotificationModule } from 'src/Notification/notification.module';
import { UserEnrollmentModule } from 'src/UserEnrollment/userEnrollment.module';

@Module({
    imports: [PrismaModule, NotificationModule, UserEnrollmentModule],
    providers: [ReviewService, ReviewResolver]
})
export class ReviewModule { }
