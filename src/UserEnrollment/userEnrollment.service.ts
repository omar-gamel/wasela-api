import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class UserEnrollmentService {
    constructor(private readonly prisma: PrismaService) { }

    async updateCourseProgress(courseId: string, lectureId: string, userId: string) {
        try {
            let userCourse = await this.findUserCourse(courseId, userId);
            if (!userCourse)
                throw new HttpException('Forbidden you are not enrolled in this course', HttpStatus.FORBIDDEN);

            const dayLectureIndex = userCourse.course.days.findIndex(day => {
                return day.lectures.some(lecture => lecture.id.toString() === lectureId.toString())
            });
            if (dayLectureIndex < 0)
                throw new HttpException('Lecture not found', HttpStatus.NOT_FOUND);

            const isDayAvaliable = userCourse.course.days[dayLectureIndex].availableFor.find(user => user.id.toString() === userId.toString());
            if (!isDayAvaliable)
                throw new HttpException('The day of Lecture not avaliable yet', HttpStatus.BAD_REQUEST);

            const index = userCourse.watchedLectures.findIndex(lecture => lecture.id.toString() === lectureId.toString());
            if (index < 0) {
                userCourse = await this.prisma.userCourses.update({
                    where: { id: userCourse.id },
                    data: { watchedLectures: { connect: { id: lectureId } } },
                    include: {
                        user: true,
                        watchedLectures: true,
                        course: { include: { days: { include: { availableFor: true, lectures: true } } } }
                    }
                });
            } else {
                userCourse = await this.prisma.userCourses.update({
                    where: { id: userCourse.id },
                    data: { watchedLectures: { disconnect: { id: lectureId } } },
                    include: {
                        user: true,
                        watchedLectures: true,
                        course: { include: { days: { include: { availableFor: true, lectures: true } } } }
                    }
                });
            }
            const finishedCount = userCourse.watchedLectures.length;
            const lecturesCount = userCourse.course.days.reduce((acc, day) => {
                acc += day.lectures.length;
                return acc;
            }, 0);
            userCourse = await this.prisma.userCourses.update({
                where: { id: userCourse.id },
                data: { progress: (finishedCount / lecturesCount) * 100 },
                include: {
                    user: true,
                    watchedLectures: true,
                    course: { include: { days: { include: { availableFor: true, lectures: true } } } }
                }
            });
            return { code: 200, message: 'Course progress updated successfully', success: true, userCourse };
        } catch (error) {
            throw error;
        }
    };

    async updatePathProgress(pathId: string, courseId: string, lectureId: string, userId: string) {
        try {
            let userPath = await this.findUserPath(pathId, userId);
            if (!userPath)
                throw new HttpException('Forbidden you are not enrolled in this path', HttpStatus.FORBIDDEN);

            const courseIndex = userPath.path.courses.findIndex(course => course.id.toString() === courseId.toString());
            if (courseIndex < 0)
                throw new HttpException('Course not exist in this path', HttpStatus.NOT_FOUND);

            const dayIndex = userPath.path.courses[courseIndex].days.findIndex(day => {
                return day.lectures.some(lecture => lecture.id.toString() === lectureId.toString())
            });
            if (dayIndex < 0)
                throw new HttpException('Lecture not exist in this course', HttpStatus.NOT_FOUND);

            const isDayAvaliable = userPath.path.courses[courseIndex].days[dayIndex].availableFor.find(user => user.id.toString() === userId.toString());
            if (!isDayAvaliable)
                throw new HttpException('The day of Lecture not avaliable yet', HttpStatus.BAD_REQUEST);

            const lecture = userPath.watchedLectures.find(lecture => lecture.id.toString() === lectureId.toString());
            if (!lecture) {
                userPath = await this.prisma.userPaths.update({
                    where: { id: userPath.id },
                    data: { watchedLectures: { connect: { id: lectureId } } },
                    include: {
                        user: true,
                        watchedLectures: true,
                        path: { include: { courses: { include: { days: { include: { availableFor: true, lectures: true } } } } } },
                    }
                });
            } else {
                userPath = await this.prisma.userPaths.update({
                    where: { id: userPath.id },
                    data: { watchedLectures: { disconnect: { id: lectureId } } },
                    include: {
                        user: true,
                        watchedLectures: true,
                        path: { include: { courses: { include: { days: { include: { availableFor: true, lectures: true } } } } } },
                    }
                });
            }
            const finishedCount = userPath.watchedLectures.length;
            let lecturesCount = 0;
            userPath.path.courses.forEach(course => {
                course.days.forEach(day => lecturesCount += day.lectures.length)
            });
            userPath = await this.prisma.userPaths.update({
                where: { id: userPath.id },
                data: { progress: (finishedCount / lecturesCount) * 100 },
                include: {
                    user: true,
                    watchedLectures: true,
                    path: { include: { courses: { include: { days: { include: { availableFor: true, lectures: true } } } } } },
                }
            });
            return { code: 200, message: 'Course progress updated successfully', success: true, userPath };
        } catch (error) {
            throw error;
        }
    };

    async myCourses(userId: string) {
        const user = await this.prisma.users.findOne({
            where: { id: userId },
            include: {
                userCourses: {
                    include: {
                        user: true,
                        course: { include: { days: { include: { availableFor: true, lectures: true } } } },
                        watchedLectures: true
                    }
                }
            }
        });
        return user.userCourses;
    };

    async myPaths(userId: string) {
        const user = await this.prisma.users.findOne({
            where: { id: userId },
            include: {
                userPaths: {
                    include: {
                        user: true,
                        watchedLectures: true,
                        path: { include: { courses: { include: { days: { include: { availableFor: true, lectures: true } } } } } }
                    }
                }
            }
        });
        return user.userPaths;
    };

    async checkUserEnrollmentCourse(courseId: string, userId: string) {
        const userCourse = await this.findUserCourse(courseId, userId);
        if (userCourse)
            return true

        const userPaths = await this.myPaths(userId);
        const userPathCourse = userPaths.find(userPath => {
            return userPath.path.courses.some(course => course.id.toString() === courseId.toString())
        });
        if (userPathCourse)
            return true;

        return false;
    };

    async findUserCourse(courseId: string, userId: string) {
        const course = await this.prisma.courses.findOne({ where: { id: courseId } });
        if (!course)
            throw new HttpException('Course not found', HttpStatus.NOT_FOUND);

        const userCourses = await this.myCourses(userId);
        return userCourses.find(userCourse => userCourse.course.id.toString() === courseId.toString());
    };

    async findUserPath(pathId: string, userId: string) {
        const path = await this.prisma.paths.findOne({ where: { id: pathId } });
        if (!path)
            throw new HttpException('Path not found', HttpStatus.NOT_FOUND);

        const userPaths = await this.myPaths(userId);
        return userPaths.find(userPath => userPath.path.id.toString() === pathId.toString());
    };
}
