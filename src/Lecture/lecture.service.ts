import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DayService } from 'src/Day/day.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CreateLectureInput } from './dto/createLecture.input';
import { User } from 'src/User/models/user.model';
import { UpdateLectureInput } from './dto/updateLecture.input';

@Injectable()
export class LectureService {
    constructor(private readonly prisma: PrismaService, private readonly dayService: DayService) { }

    private async findLecture(id: string) {
        return await this.prisma.lectures.findOne({ where: { id }, include: { day: true } })
    };

    async addDayLecture(dayId: string, input: CreateLectureInput, user: User) {
        try {
            const day = await this.dayService.findDay(dayId);
            if (!day)
                throw new HttpException('Day not found', HttpStatus.NOT_FOUND);

            if (user.roles === 'INSTRUCTOR' && day.course.instructor.id.toString() !== user.id.toString())
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

            const lecture = await this.prisma.lectures.create({
                data: {
                    ...input,
                    day: { connect: { id: dayId } }
                },
                include: { day: true }
            });
            return { code: 201, message: 'Lecture added successfully', success: true, lecture };
        } catch (error) {
            throw error;
        }
    };

    async updateDayLecture(dayId: string, lectureId: string, input: UpdateLectureInput, user: User) {
        try {
            const day = await this.dayService.findDay(dayId);
            if (!day)
                throw new HttpException('Day not found', HttpStatus.NOT_FOUND);

            if (user.roles === 'INSTRUCTOR' && day.course.instructor.id.toString() !== user.id.toString())
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

            let lecture = await this.findLecture(lectureId);
            if (!lecture)
                throw new HttpException('Lecture not found', HttpStatus.NOT_FOUND);

            lecture = await this.prisma.lectures.update({
                where: { id: lectureId },
                data: { ...input },
                include: { day: true }
            });
            return { code: 201, message: 'Lecture updated successfully', success: true, lecture };
        } catch (error) {
            throw error;
        }
    };


    async deleteDayLecture(dayId: string, lectureId: string, user: User) {
        try {
            const day = await this.dayService.findDay(dayId);
            if (!day)
                throw new HttpException('Day not found', HttpStatus.NOT_FOUND);

            if (user.roles === 'INSTRUCTOR' && day.course.instructor.id.toString() !== user.id.toString())
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

            const lecture = await this.findLecture(lectureId);
            if (!lecture)
                throw new HttpException('Lecture not found', HttpStatus.NOT_FOUND);

            await this.prisma.lectures.delete({ where: { id: lectureId } });
            return { code: 200, message: 'Lecture deleted successfully', success: true };
        } catch (error) {
            throw error;
        }
    };
}



