import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { PubSubEngine } from 'type-graphql';
import { PrismaService } from 'src/Prisma/prisma.service';
import { User } from 'src/User/models/user.model';
import { CommentPaginationInput } from './dto/commentPagination.input';
import { UserEnrollmentService } from 'src/UserEnrollment/userEnrollment.service';
import { NotificationService } from 'src/Notification/notification.service';
import { NotificationType } from 'src/Notification/models/notification.model';
import { UpdateCommentArgs } from './dto/updateComment.args';
import { CreateCommentArgs } from './dto/createComment.args';

@Injectable()
export class CommentService {
    constructor(
        @Inject('PUB_SUB') private pubSub: PubSubEngine,
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationService,
        private readonly userEnrollmentService: UserEnrollmentService
    ) { }

    async addPlaylistItemComment(playlistItemId: string, args: CreateCommentArgs, userId: string) {
        try {
            const playlistItem = await this.prisma.playlistItems.findOne({ where: { id: playlistItemId } });
            if (!playlistItem)
                throw new HttpException('Playlist item not found', HttpStatus.NOT_FOUND);

            const comment = await this.prisma.comments.create({
                data: {
                    text: args.text,
                    author: { connect: { id: userId } },
                    playlistItem: { connect: { id: playlistItemId } }
                },
                include: { author: true }
            });
            this.pubSub.publish('commentAdded', { 'playlistItemId': playlistItemId, 'playlistItemCommentAdded': comment });
            return { code: 201, message: 'Comment added successfully', success: true, comment };
        } catch (error) {
            throw error;
        }
    };

    async addArticleComment(articleId: string, args: CreateCommentArgs, userId: string) {
        try {
            const article = await this.prisma.articles.findOne({ where: { id: articleId } });
            if (!article)
                throw new HttpException('Article not found', HttpStatus.NOT_FOUND);

            const comment = await this.prisma.comments.create({
                data: {
                    text: args.text,
                    author: { connect: { id: userId } },
                    article: { connect: { id: articleId } }
                },
                include: { author: true }
            });
            this.pubSub.publish('commentAdded', { 'articleId': articleId, 'articleCommentAdded': comment });
            return { code: 201, message: 'Comment added successfully', success: true, comment };
        } catch (error) {
            throw error;
        }
    };

    async addDayComment(dayId: string, args: CreateCommentArgs, user: User) {
        try {
            const day = await this.prisma.days.findOne({
                where: { id: dayId },
                include: { course: { include: { instructor: true } } }
            });
            if (!day)
                throw new HttpException('Day not found', HttpStatus.NOT_FOUND);

            const userCourse = await this.userEnrollmentService.checkUserEnrollmentCourse(day.course.id, user.id);
            if (user.roles === 'STUDENT') {
                if (!userCourse)
                    throw new HttpException('Forbidden you are not enrolled in this course', HttpStatus.FORBIDDEN);
            }

            if (user.roles === 'INSTRUCTOR') {
                if (day.course.instructor.id.toString() !== user.id.toString() && !userCourse)
                    throw new HttpException('Forbidden you are not enrolled in this course', HttpStatus.FORBIDDEN);
            }

            const comment = await this.prisma.comments.create({
                data: {
                    text: args.text,
                    author: { connect: { id: user.id } },
                    day: { connect: { id: dayId } }
                },
                include: { author: true }
            });
            this.pubSub.publish('commentAdded', { 'dayId': dayId, 'dayCommentAdded': comment });
            return { code: 201, message: 'Comment added successfully', success: true, comment };
        } catch (error) {
            throw error;
        }
    };

    async updateComment(args: UpdateCommentArgs, userId: string) {
        try {
            let comment = await this.prisma.comments.findOne({
                where: { id: args.commentId },
                include: { author: true, reporters: true, day: { include: { course: { include: { instructor: true } } } } }
            });
            if (!comment)
                throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);

            if (comment.author.id.toString() != userId.toString())
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

            comment = await this.prisma.comments.update({
                where: { id: args.commentId },
                data: { text: args.text },
                include: { author: true, reporters: true, day: { include: { course: { include: { instructor: true } } } } }
            });
            return { code: 201, message: 'Comment added successfully', success: true, comment };
        } catch (error) {
            throw error;
        }
    };

    async deleteComment(commentId: string, user: User) {
        try {
            const comment = await this.prisma.comments.findOne({
                where: { id: commentId },
                include: { author: true, reporters: true, day: { include: { course: { include: { instructor: true } } } } }
            });
            if (!comment)
                throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);

            if (user.roles === 'STUDENT' || user.roles === 'INSTRUCTOR' && comment.author.id.toString() != user.id.toString())
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

            await this.prisma.comments.delete({ where: { id: commentId } });
            return { code: 201, message: 'Comment delete successfully', success: true, comment };
        } catch (error) {
            throw error;
        }
    };

    async toggleCommentActivation(commentId: string) {
        try {
            let comment = await this.prisma.comments.findOne({
                where: { id: commentId },
                include: { author: true, reporters: true, day: { include: { course: { include: { instructor: true } } } } }
            });
            if (!comment)
                throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);

            comment = await this.prisma.comments.update({
                where: { id: commentId },
                data: { isActive: !comment.isActive },
                include: { author: true, reporters: true, day: { include: { course: { include: { instructor: true } } } } }
            });
            return { code: 200, message: 'Comment updated successfully', success: true, comment };
        } catch (error) {
            throw error;
        }
    };

    async reportComment(commentId: string, user: User) {
        try {
            let comment = await this.prisma.comments.findOne({
                where: { id: commentId },
                include: { author: true, reporters: true, day: { include: { course: { include: { instructor: true } } } } }
            });
            if (!comment)
                throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);

            // if (comment.author.id.toString() === user.id.toString())
            //     throw new HttpException('You can not report your own comment', HttpStatus.BAD_REQUEST);

            // let reporters = comment.reporters;
            // if (!reporters.length || reporters.some(reporter => reporter.id.toString() !== user.id.toString())) {
            //     comment = await this.prisma.comments.update({
            //         where: { id: commentId },
            //         data: {
            //             isReported: true,
            //             reporters: { connect: { id: user.id } }
            //         },
            //         include: { author: true, reporters: true, day: { include: { course: { include: { instructor: true } } } } }
            //     });
            // }
            const admins = await this.prisma.users.findMany({ where: { roles: 'ADMIN' } });
            const recipients = admins.map(admin => admin.id);
            await this.notificationService.fireNewNotification({
                message: ' هناك بﻻغ بشأن احد التعليقات ',
                to: recipients,
                type: NotificationType.COMMENT_REPORTED
            });
            return { code: 200, message: 'Comment reported successfully', success: true, comment };
        } catch (error) {
            throw error;
        }
    };

    async comments(input: CommentPaginationInput) {
        const comments = await this.prisma.comments.findMany({
            where: {
                AND: [
                    { isActive: input.isActive },
                    { isReported: input.isReported }
                ]
            },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: { author: true, reporters: true, day: { include: { course: { include: { instructor: true } } } } }
        });
        const count = await this.prisma.comments.count();
        return { comments, totalCount: count };
    };
}
