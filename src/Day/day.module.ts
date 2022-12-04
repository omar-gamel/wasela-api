import { Module } from '@nestjs/common';
import { UserEnrollmentService } from 'src/UserEnrollment/userEnrollment.service';
import { DayResolver } from './day.resolver';
import { DayService } from './day.service';
import { SlugService } from 'src/Share/slug/slug.service';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { CourseModule } from 'src/Course/course.module';

@Module({
    imports: [PrismaModule, CourseModule],
    providers: [
        DayService,
        DayResolver,
        SlugService,
        UserEnrollmentService
    ],
    exports:[DayService]
})
export class DayModule { }
