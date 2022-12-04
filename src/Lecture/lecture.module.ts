import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { LectureResolver } from './lecture.resolver';
import { LectureService } from './lecture.service';
import { DayModule } from 'src/Day/day.module';

@Module({
    imports: [PrismaModule, DayModule],
    providers: [LectureService, LectureResolver]
})
export class LectureModule { }
