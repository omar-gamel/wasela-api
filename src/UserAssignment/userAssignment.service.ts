import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CreateUserAssignmentArgs } from './dto/createUserAssignment.args';
import { User } from 'src/User/models/user.model';
import { UserAssignmentPaginationInput } from './dto/userAssignmentPagination.input';
import { UserEnrollmentService } from 'src/UserEnrollment/userEnrollment.service';

@Injectable()
export class UserAssignmentService {
    constructor(private readonly prisma: PrismaService, private readonly userEnrollmentService: UserEnrollmentService) { }

    private async findUserAssignment(id: string) {
        return await this.prisma.userAssignments.findOne({
            where: { id },
            include: { author: true, likes: true, day: { include: { course: { include: { instructor: true } } } } }
        });
    };

    async addUserAssignmentAswer(dayId: string, args: CreateUserAssignmentArgs, user: User) {
        try {
            const day = await this.prisma.days.findOne({ where: { id: dayId }, include: { course: { include: { instructor: true } } } });
            if (!day)
                throw new HttpException('Day not found', HttpStatus.NOT_FOUND);

            const exists = await this.userEnrollmentService.checkUserEnrollmentCourse(day.course.id, user.id);
            if (user.roles === 'STUDENT' && !exists)
                throw new HttpException('Forbidden you are not enrolled in this course', HttpStatus.FORBIDDEN);

            if (user.roles === 'INSTRUCTOR' && day.course.instructor.id.toString() !== user.id.toString() && !exists)
                throw new HttpException('Forbidden you are not enrolled in this course', HttpStatus.FORBIDDEN);

            const userAssignment = await this.prisma.userAssignments.create({
                data: {
                    description: args.description,
                    files: { set: args.files },
                    day: { connect: { id: dayId } },
                    author: { connect: { id: user.id } }
                },
                include: { author: true, likes: true, day: true }
            });
            return { code: 200, message: 'User assignment added successfully', success: true, userAssignment };
        } catch (error) {
            throw error;
        }
    };

    async toggleAppearUserAssignmentOnSpecialWorkPage(userAssignmentId: string, user: User) {
        try {
            let userAssignment = await this.findUserAssignment(userAssignmentId);
            if (!userAssignment)
                throw new HttpException('User assignment answer not found', HttpStatus.NOT_FOUND);

            if (user.roles === 'INSTRUCTOR' && userAssignment.day.course.instructor.id.toString() !== user.id.toString())
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

            userAssignment = await this.prisma.userAssignments.update({
                where: { id: userAssignmentId },
                data: { appearOnSpecialWorkPage: !userAssignment.appearOnSpecialWorkPage },
                include: { author: true, likes: true, day: { include: { course: { include: { instructor: true } } } } }
            });
            return { code: 200, message: 'User assignment updated successfully', success: true, userAssignment };
        } catch (error) {
            throw error;
        }
    };

    async toggleUserAssignmentActivation(userAssignmentId: string) {
        try {
            let userAssignment = await this.findUserAssignment(userAssignmentId);
            if (!userAssignment)
                throw new HttpException('User assignment answer not found', HttpStatus.NOT_FOUND);

            userAssignment = await this.prisma.userAssignments.update({
                where: { id: userAssignmentId },
                data: { isActive: !userAssignment.isActive },
                include: { author: true, likes: true, day: { include: { course: { include: { instructor: true } } } } }
            });
            return { code: 200, message: 'User assignment status changed', success: true, userAssignment };
        } catch (error) {
            throw error;
        }
    };

    async addUserAssignmentLikeAction(userAssignmentId: string, user: User) {
        try {
            let userAssignment = await this.findUserAssignment(userAssignmentId);
            if (!userAssignment)
                throw new HttpException('User assignment answer not found', HttpStatus.NOT_FOUND);

            const userAssignmentLikes = userAssignment.likes;
            if (!userAssignmentLikes.length || userAssignmentLikes.some(userLike => userLike.id.toString() !== user.id.toString())) {
                userAssignment = await this.prisma.userAssignments.update({
                    where: { id: userAssignmentId },
                    data: { likes: { connect: { id: user.id } } },
                    include: { author: true, likes: true, day: { include: { course: { include: { instructor: true } } } } }
                });
            }
            return { code: 200, message: 'User assignment updated successfully', success: true, userAssignment };
        } catch (error) {
            throw error;
        }
    };

    async myAssignmentAnswers(userId: string) {
        return await this.prisma.userAssignments.findMany({
            where: { author: { id: userId } },
            include: { author: true, likes: true, day: { include: { course: { include: { instructor: true } } } } }
        });
    };

    async dayAssignmentsAnswers(input: UserAssignmentPaginationInput) {
        return await this.prisma.userAssignments.findMany({
            where: {
                AND: [
                    { day: { id: input.dayId } },
                    { isActive: input.isActive },
                    { appearOnSpecialWorkPage: input.appearOnSpecialWorkPage }
                ]
            },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: { author: true, likes: true, day: { include: { course: { include: { instructor: true } } } } }
        });
    };
}
