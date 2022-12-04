import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { User } from 'src/User/models/user.model';
import { CreateDayInput } from './dto/createDay.input';
import { UpdateDayInput } from './dto/updateDay.input';
import { DayReviewArgs } from './dto/dayReview.args';
import { UserEnrollmentService } from 'src/UserEnrollment/userEnrollment.service';
import { SlugService } from 'src/Share/slug/slug.service';
import { CourseService } from 'src/Course/course.service';
import { CreateLectureInput } from 'src/Lecture/dto/createLecture.input';
import { UpdateAssignmentInput } from 'src/Assignment/dto/updateAssignment.input';

@Injectable()
export class DayService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly slugService: SlugService,
        private readonly courseService: CourseService,
        private readonly userEnrollmentService: UserEnrollmentService) { }

    async findDay(id: string) {
        return await this.prisma.days.findOne({
            where: { id },
            include: {
                course: { include: { instructor: true } },
                lectures: true,
                assignments: true,
                userAssignments: true,
                comments: { include: { author: true } },
                reviews: { include: { author: true } }
            }
        });
    };

    async addDay(
        courseId: string,
        dayInput: CreateDayInput,
        lectureInput: CreateLectureInput[],
        assignmentInput: UpdateAssignmentInput[],
        user: User
    ) {
        try {
            const course = await this.courseService.findCourse(courseId);
            if (!course)
                throw new HttpException('Course not found', HttpStatus.NOT_FOUND);

            if (user.roles === 'INSTRUCTOR' && course.instructor.id.toString() !== user.id.toString())
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

            assignmentInput = assignmentInput ? assignmentInput : [];
            const day = await this.prisma.days.create({
                data: {
                    ...dayInput,
                    course: { connect: { id: courseId } },
                    attachments: { set: dayInput.attachments ? dayInput.attachments : [] },
                    assignments: { create: [...assignmentInput] },
                    lectures: { create: [...lectureInput] },
                    slug: await this.slugService.generateSlug(dayInput.title)
                },
                include: { course: true, lectures: true, assignments: true }
            });
            return { code: 201, message: 'Day added successfully', success: true, day };
        } catch (error) {
            throw error;
        }
    };

    async updateDayInfo(dayId: string, input: UpdateDayInput, user: User) {
        try {
            let day = await this.findDay(dayId);
            if (!day)
                throw new HttpException('Day not found', HttpStatus.NOT_FOUND);

            const course = await this.courseService.findCourse(day.course.id);
            if (user.roles === 'INSTRUCTOR' && course.instructor.id.toString() !== user.id.toString())
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

            input.slug = input.title ? await this.slugService.generateSlug(input.title) : day.slug;
            day = await this.prisma.days.update({
                where: { id: dayId },
                data: { ...input },
                include: {
                    course: { include: { instructor: true } },
                    lectures: true,
                    assignments: true,
                    userAssignments: true,
                    comments: { include: { author: true } },
                    reviews: { include: { author: true } }
                }
            });
            return { code: 200, message: 'Day updated successfully', success: true, day };
        } catch (error) {
            throw error;
        }
    };

    async toggleDayActivation(dayId: string) {
        try {
            let day = await this.findDay(dayId);
            if (!day)
                throw new HttpException('Day not found', HttpStatus.NOT_FOUND);

            day = await this.prisma.days.update({
                where: { id: dayId },
                data: { isActive: !day.isActive },
                include: {
                    course: { include: { instructor: true } },
                    lectures: true,
                    assignments: true,
                    userAssignments: true,
                    comments: { include: { author: true } },
                    reviews: { include: { author: true } }
                }
            });
            return { code: 200, message: 'Day status changed', success: true, day };
        } catch (error) {
            throw error;
        }
    }; 

    async addOrUpdateDayReview({ dayId, dayRate }: DayReviewArgs, userId: string) {
        try {
            let day = await this.findDay(dayId);
            if (!day)
                throw new HttpException('Day not found', HttpStatus.NOT_FOUND);

            const userCourse = await this.userEnrollmentService.findUserCourse(day.course.id, userId);
            if (!userCourse)
                throw new HttpException('Forbidden you are not enrolled in this course', HttpStatus.FORBIDDEN);

            const reviews = day.reviews;
            const index = reviews.findIndex(review => review.author.id.toString() === userId.toString());
            if (index < 0) {
                day = await this.prisma.days.update({
                    where: { id: dayId },
                    data: {
                        reviews: {
                            create: {
                                author: { connect: { id: userId } },
                                dayRate: dayRate
                            }
                        }
                    },
                    include: {
                        course: { include: { instructor: true } },
                        lectures: true,
                        assignments: true,
                        userAssignments: true,
                        comments: { include: { author: true } },
                        reviews: { include: { author: true } }
                    }
                });
            } else {
                day = await this.prisma.days.update({
                    where: { id: dayId },
                    data: {
                        reviews: {
                            update: {
                                where: { id: reviews[index].id },
                                data: { dayRate: dayRate }
                            }
                        }
                    },
                    include: {
                        course: { include: { instructor: true } },
                        lectures: true,
                        assignments: true,
                        userAssignments: true,
                        comments: { include: { author: true } },
                        reviews: { include: { author: true } }
                    }
                });
            }
            return { code: 200, message: 'Review submitted successfully', success: true, day };
        } catch (error) {
            throw error;
        }
    };

    async day(slug: string) {
        return await this.prisma.days.findOne({
            where: { slug },
            include: {
                course: { include: { instructor: true } },
                lectures: true,
                assignments: true,
                userAssignments: true,
                comments: { include: { author: true } },
                reviews: { include: { author: true } }
            }
        });
    };
}
