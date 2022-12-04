import { Module } from '@nestjs/common';
import { NotificationModule } from 'src/Notification/notification.module';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { CourseService } from './course.service';
import { CourseResolver } from './course.resolver';
import { SlugService } from 'src/Share/slug/slug.service';
import { CategoryModule } from 'src/Category/category.module';

@Module({
    imports: [PrismaModule, NotificationModule, CategoryModule],
    providers: [CourseService, CourseResolver, SlugService],
    exports: [CourseService]
})
export class CourseModule { }
