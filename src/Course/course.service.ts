import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CourseReviewStatus } from './models/course.model';
import { CreateCourseInput } from './dto/createCourse.input';
import { UpdateCourseInput } from './dto/updateCourse.input';
import { CoursePaginationInput } from './dto/coursePagination.input';
import { ChangeCourseStatusArgs } from './dto/changeCourseStatus.args';
import { CreateCourseDayInput } from './dto/createCourseDay.input';
import { User } from 'src/User/models/user.model';
import { SlugService } from 'src/Share/slug/slug.service';
import { NotificationService } from 'src/Notification/notification.service';
import { NotificationType } from 'src/Notification/models/notification.model';
import { CategoryService } from 'src/Category/category.service';

@Injectable()
export class CourseService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly slugService: SlugService,
        private readonly categoryService: CategoryService,
        private readonly notificationService: NotificationService
    ) { }

    async findCourse(id: string) {
        return await this.prisma.courses.findOne({
            where: { id },
            include: {
                instructor: true,
                category: true,
                softwareUsed: true,
                days: { include: { lectures: true, assignments: true, comments: { include: { author: true } } } }
            }
        });
    };

    async createCourse(courseInput: CreateCourseInput, daysInput: CreateCourseDayInput[], user: User) {
        try {
            if (user.roles === 'INSTRUCTOR')
                courseInput.status = CourseReviewStatus.PENDING;

            if (!courseInput.instructor)
                courseInput.instructor = user.id;

            let days = [];
            for (const day of daysInput) {
                day.assignments = day.assignments ? day.assignments : [];
                day.slug = await this.slugService.generateSlug(day.title);
                days.push({
                    rank: day.rank,
                    title: day.title,
                    slug: day.slug,
                    description: day.description,
                    attachments: {
                        set: day.attachments ? day.attachments : []
                    },
                    lectures: {
                        create: [...day.lectures]
                    },
                    assignments: {
                        create: [...day.assignments]
                    }
                });
            };
            const category = await this.categoryService.findCategoryById(courseInput.category);
            if (!category)
                throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

            const course = await this.prisma.courses.create({
                data: {
                    ...courseInput,
                    category: { connect: { id: courseInput.category } },
                    instructor: { connect: { id: courseInput.instructor } },
                    deliverables: {
                        set: courseInput.deliverables
                    },
                    days: { create: [...days] },
                    softwareUsed: { create: [...courseInput.softwareUsed] },
                    slug: await this.slugService.generateSlug(courseInput.name)
                },
                include: {
                    instructor: true,
                    category: true,
                    softwareUsed: true,
                    days: { include: { lectures: true, assignments: true, comments: { include: { author: true } } } }
                }
            });
            if (user.roles === 'INSTRUCTOR') {
                const admins = await this.prisma.users.findMany({ where: { roles: 'ADMIN' } });
                const recipients = admins.map(admin => admin.id);
                await this.notificationService.fireNewNotification({
                    message: ' هناك دورة تدريبية جديدة يجب مراجعتها ',
                    to: recipients,
                    model: { name: 'courses', slug: course.slug },
                    type: NotificationType.NEW_COURSE_SUBMITTED
                });
            }
            return { code: 201, message: 'Course created successfully', success: true, course };
        } catch (error) {
            throw error;
        }
    };

    async updateCourseInfo(courseId: string, input: UpdateCourseInput, user: User) {
        try {
            let course = await this.findCourse(courseId);
            if (!course)
                throw new HttpException('Course not found', HttpStatus.NOT_FOUND);

            if (user.roles === 'INSTRUCTOR' && course.instructor.id.toString() !== user.id.toString())
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

            if (input.category) {
                const category = await this.categoryService.findCategoryById(input.category);
                if (!category)
                    throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
            } else {
                input.category = course.category.id;
            }

            if (input.softwareUsed) {
                await this.prisma.softwareUseds.deleteMany({ where: { course: { id: courseId } } });
            } else {
                input.softwareUsed = [];
            }

            course = await this.prisma.courses.update({
                where: { id: courseId },
                data: {
                    ...input,
                    category: { connect: { id: input.category } },
                    softwareUsed: { create: [...input.softwareUsed] },
                    deliverables: {
                        set: input.deliverables ? input.deliverables : course.deliverables
                    },
                    slug: input.name ? await this.slugService.generateSlug(input.name) : course.slug
                },
                include: {
                    instructor: true,
                    category: true,
                    softwareUsed: true,
                    days: { include: { lectures: true, assignments: true, comments: { include: { author: true } } } }
                }
            });
            return { code: 200, message: 'Course updated successfully', success: true, course };
        } catch (error) {
            throw error;
        }
    };

    async changeCourseStatus({ courseId, status }: ChangeCourseStatusArgs) {
        try {
            let course = await this.findCourse(courseId);
            if (!course)
                throw new HttpException('Course not found', HttpStatus.NOT_FOUND);

            course = await this.prisma.courses.update({
                where: { id: courseId },
                data: { status: status },
                include: {
                    category: true,
                    instructor: true,
                    softwareUsed: true,
                    days: { include: { lectures: true, assignments: true, comments: { include: { author: true } } } }
                }
            });
            return { code: 200, message: 'course has been reviewed', success: true, course };
        } catch (error) {
            throw error;
        }
    };

    async toggleCourseActivation(courseId: string) {
        try {
            let course = await this.findCourse(courseId);
            if (!course)
                throw new HttpException('Course not found', HttpStatus.NOT_FOUND);

            course = await this.prisma.courses.update({
                where: { id: courseId },
                data: { isActive: !course.isActive },
                include: {
                    instructor: true,
                    category: true,
                    softwareUsed: true,
                    days: { include: { lectures: true, assignments: true, comments: { include: { author: true } } } }
                }
            });
            return { code: 200, message: 'Course status changed', success: true, course };
        } catch (error) {
            throw error;
        }
    };

    async course(slug: string) {
        return await this.prisma.courses.findOne({
            where: { slug },
            include: {
                instructor: true,
                category: true,
                days: { include: { lectures: true, assignments: true, comments: { include: { author: true } } } }
            }
        });
    };

    async courses(input: CoursePaginationInput) {
        const minPrice = input.priceRange ? { price: { gte: input.priceRange.min } } : {};
        const maxPrice = input.priceRange ? { price: { lte: input.priceRange.max } } : {};
        const instructorsIds = input.instructorsIds ? { instructor: { id: { in: input.instructorsIds } } } : {};
        const courses = await this.prisma.courses.findMany({
            where: {
                AND: [
                    minPrice,
                    maxPrice,
                    instructorsIds,
                    { name: { contains: input.keyword } },
                    { isActive: { equals: input.isActive } },
                    { status: { equals: input.status } }
                ]
            },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: {
                instructor: true,
                category: true,
                days: { include: { lectures: true, assignments: true, comments: { include: { author: true } } } }
            }
        });
        const count = await this.prisma.courses.count();
        return { totalCount: count, courses };
    };
}
