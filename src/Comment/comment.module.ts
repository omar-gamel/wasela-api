import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { NotificationModule } from 'src/Notification/notification.module';
import { UserEnrollmentModule } from 'src/UserEnrollment/userEnrollment.module';

@Module({
    imports: [
        PrismaModule,
        NotificationModule,
        UserEnrollmentModule 
    ],
    providers: [CommentService, CommentResolver]
})
export class CommentModule { }
