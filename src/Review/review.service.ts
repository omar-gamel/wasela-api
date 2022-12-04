import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserEnrollmentService } from 'src/UserEnrollment/userEnrollment.service';
import { NotificationType } from 'src/Notification/models/notification.model';
import { PrismaService } from 'src/Prisma/prisma.service';
import { NotificationService } from 'src/Notification/notification.service';
import { CreateCourseReviewInput } from './dto/createCourseReview.input';
import { UpdateCourseReviewInput } from './dto/updateCourseReview.input';
import { ReviewPaginationInput } from './dto/reviewPaginationInput.input';

@Injectable()
export class ReviewService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationService,
        private readonly userEnrollmentService: UserEnrollmentService
    ) { }

    private async findReview(id: string) {
        return await this.prisma.reviews.findOne({
            where: { id },
            include: { author: true, course: true, reporters: true }
        });
    };

    async submitCourseReview(input: CreateCourseReviewInput, userId: string) {
        try {
            const course = await this.prisma.courses.findOne({
                where: { id: input.courseId },
                include: { instructor: true, review: { include: { author: true } } }
            });
            if (!course)
                throw new HttpException('Course not found', HttpStatus.NOT_FOUND);

            if (course.instructor.id.toString() === userId.toString())
                throw new HttpException('You can not review ur own course', HttpStatus.BAD_REQUEST);

            const exists = await this.userEnrollmentService.checkUserEnrollmentCourse(input.courseId, userId);
            if (!exists)
                throw new HttpException('Forbidden you are not enrolled in this course', HttpStatus.FORBIDDEN);

            let review = course.review.find(review => review.author.id.toString() === userId.toString());
            if (review)
                throw new HttpException('You already submitted review for this course before you can only update it', HttpStatus.BAD_REQUEST);

            review = await this.prisma.reviews.create({
                data: {
                    text: input.text,
                    courseRate: input.courseRate,
                    instructorRate: input.instructorRate,
                    author: { connect: { id: userId } },
                    course: { connect: { id: input.courseId } },
                },
                include: { author: true, course: true, reporters: true }
            });
            return { code: 201, message: 'Review submitted successfully', success: true, review };
        } catch (error) {
            throw error;
        }
    };

    async updateReview(reviewId: string, input: UpdateCourseReviewInput, userId: string) {
        try {
            let review = await this.findReview(reviewId);
            if (!review)
                throw new HttpException('Review not found', HttpStatus.NOT_FOUND);

            if (review.author.id.toString() !== userId.toString())
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

            review = await this.prisma.reviews.update({
                where: { id: reviewId },
                data: { ...input },
                include: { author: true, course: true, reporters: true }
            });
            return { code: 201, message: 'Review updated successfully', success: true, review };
        } catch (error) {
            throw error;
        }
    };

    async deleteReview(reviewId: string) {
        try {
            const review = await this.findReview(reviewId);
            if (!review)
                throw new HttpException('Review not found', HttpStatus.NOT_FOUND);

            await this.prisma.reviews.delete({ where: { id: reviewId } });
            return { code: 200, message: 'Review deleted successfully', success: true };
        } catch (error) {
            throw error;
        }
    };

    async toggleReviewActivation(reviewId: string) {
        try {
            let review = await this.findReview(reviewId);
            if (!review)
                throw new HttpException('Review not found', HttpStatus.NOT_FOUND);

            review = await this.prisma.reviews.update({
                where: { id: reviewId },
                data: { isActive: !review.isActive },
                include: { author: true, course: true, reporters: true }
            });
            return { code: 201, message: 'Review updated successfully', success: true, review };
        } catch (error) {
            throw error;
        }
    };

    async reportCourseReview(reviewId: string, userId: string) {
        try {
            let review = await this.findReview(reviewId);
            if (!review)
                throw new HttpException('Review not found', HttpStatus.NOT_FOUND);

            if (review.author.id.toString() === userId.toString())
                throw new HttpException('You can not report your own review', HttpStatus.BAD_REQUEST);

            let reporters = review.reporters;
            if (!reporters.length || reporters.some(reporter => reporter.id.toString() !== userId.toString())) {
                review = await this.prisma.reviews.update({
                    where: { id: reviewId },
                    data: {
                        isReported: true,
                        reporters: { connect: { id: userId } }
                    },
                    include: { author: true, course: true, reporters: true }
                });
            }
            const admins = await this.prisma.users.findMany({ where: { roles: 'ADMIN' } });
            const recipients = admins.map(admin => admin.id);
            await this.notificationService.fireNewNotification({
                message: 'هناك بﻻغ بشأن احد المراجعات لدورة تدريبيه',
                to: recipients,
                type: NotificationType.REVIEW_REPORTED
            });
            return { code: 201, message: 'Review reported successfully', success: true, review };
        } catch (error) {
            throw error;
        }
    };

    async review(reviewId: string) {
        return await this.findReview(reviewId);
    };

    async reviews(input: ReviewPaginationInput) {
        return await this.prisma.reviews.findMany({
            where: { course: { id: input.courseId }, isActive: input.isActive, isReported: input.isReported },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: { author: true, course: true, reporters: true }
        });
    };

    async myReview(courseId: string, userId: string) {
        const user = await this.prisma.users.findOne({
            where: { id: userId },
            include: {
                reviews: { include: { author: true, course: true, reporters: true } }
            }
        });
        return user.reviews.find(review => review.course.id.toString() === courseId.toString());
    };

    async myReviews(userId: string) {
        const user = await this.prisma.users.findOne({
            where: { id: userId },
            include: {
                reviews: { include: { author: true, course: true, reporters: true } }
            }
        });
        return user.reviews;
    };
}
