import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { DayService } from 'src/Day/day.service';
import { CreateAssignmentInput } from './dto/createAssignment.input';
import { User } from 'src/User/models/user.model';
import { UpdateAssignmentInput } from './dto/updateAssignment.input';

@Injectable()
export class AssignmentService {
    constructor(private readonly prisma: PrismaService, private readonly dayService: DayService) { }

    private async findAssignment(id: string) {
        return await this.prisma.assignments.findOne({ where: { id }, include: { day: true } })
    };

    async addDayAssignment(dayId: string, input: CreateAssignmentInput, user: User) {
        try {
            const day = await this.dayService.findDay(dayId);
            if (!day)
                throw new HttpException('Day not found', HttpStatus.NOT_FOUND);

            if (user.roles === 'INSTRUCTOR' && day.course.instructor.id.toString() !== user.id.toString())
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

            const assignment = await this.prisma.assignments.create({
                data: {
                    ...input,
                    day: { connect: { id: dayId } }
                },
                include: { day: true }
            });
            return { code: 201, message: 'Assignment added successfully', success: true, assignment };
        } catch (error) {
            throw error;
        }
    };

    async updateDayAssignment(dayId: string, assignmentId: string, input: UpdateAssignmentInput, user: User) {
        try {
            const day = await this.dayService.findDay(dayId);
            if (!day)
                throw new HttpException('Day not found', HttpStatus.NOT_FOUND);

            if (user.roles === 'INSTRUCTOR' && day.course.instructor.id.toString() !== user.id.toString())
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

            let assignment = await this.findAssignment(assignmentId);
            if (!assignment)
                throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);

            assignment = await this.prisma.assignments.update({
                where: { id: assignmentId },
                data: { ...input },
                include: { day: true }
            });
            return { code: 201, message: 'Assignment updated successfully', success: true, assignment };
        } catch (error) {
            throw error;
        }
    };


    async deleteDayAssignment(dayId: string, assignmentId: string, user: User) {
        try {
            const day = await this.dayService.findDay(dayId);
            if (!day)
                throw new HttpException('Day not found', HttpStatus.NOT_FOUND);

            if (user.roles === 'INSTRUCTOR' && day.course.instructor.id.toString() !== user.id.toString())
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

            const assignment = await this.findAssignment(assignmentId);
            if (!assignment)
                throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);

            await this.prisma.assignments.delete({ where: { id: assignmentId } });
            return { code: 200, message: 'Assignment deleted successfully', success: true };
        } catch (error) {
            throw error;
        }
    };
}
