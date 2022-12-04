import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePathInput } from './dto/createPath.input';
import { UpdatePathInput } from './dto/updatePath.input';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PathPaginationInput } from './dto/PathPagination.input';
import { SlugService } from 'src/Share/slug/slug.service';

@Injectable()
export class PathService {
    constructor(private readonly prisma: PrismaService, private readonly slugService: SlugService) { }

    async findPath(id: string) {
        return await this.prisma.paths.findOne({
            where: { id },
            include: { courses: { include: { days: true, instructor: true } } }
        });
    };

    async createPath(input: CreatePathInput) {
        try {
            if (input.courses.length < 1)
                throw new HttpException('Path must be at less have one course', HttpStatus.BAD_REQUEST);

            const courses = await this.prisma.courses.findMany({
                where: { id: { in: input.courses } }
            });
            if (!courses.length)
                throw new HttpException('Path must be at less have one valid course', HttpStatus.BAD_REQUEST);

            input.total_price = courses.reduce((acc, course) => {
                acc += course.price;
                return acc;
            }, 0);
            if (input.discount_price >= input.total_price)
                throw new HttpException('Path price must be less than total price for the included courses', HttpStatus.BAD_REQUEST);

            const path_courses = courses.map(course => { return { id: course.id } });
            const path = await this.prisma.paths.create({
                data: {
                    ...input,
                    courses: { connect: [...path_courses] },
                    slug: await this.slugService.generateSlug(input.name)
                },
                include: { courses: { include: { days: { include: { lectures: true } } } } }
            });
            return { code: 201, message: 'Path created successfully', success: true, path };
        } catch (error) {
            throw error;
        }
    };

    async updatePathInfo(pathId: string, input: UpdatePathInput) {
        try {
            let path = await this.findPath(pathId);
            if (!path)
                throw new HttpException('Path not found', HttpStatus.NOT_FOUND);

            if (input.name)
                input.slug = await this.slugService.generateSlug(input.name);

            path = await this.prisma.paths.update({
                where: { id: pathId },
                data: { ...input },
                include: { courses: { include: { days: true, instructor: true } } }
            });
            return { code: 201, message: 'Path created successfully', success: true, path };
        } catch (error) {
            throw error;
        }
    };

    async addCourseToPath(pathId: string, courseId: string) {
        try {
            let path = await this.findPath(pathId);
            if (!path)
                throw new HttpException('Path not found', HttpStatus.NOT_FOUND);

            const course = await this.prisma.courses.findOne({ where: { id: courseId } });
            if (!course)
                throw new HttpException('Course not found', HttpStatus.NOT_FOUND);

            path = await this.prisma.paths.update({
                where: { id: pathId },
                data: {
                    total_price: path.total_price + course.price,
                    courses: { connect: { id: courseId } }
                },
                include: { courses: { include: { days: true, instructor: true } } }
            });
            return { code: 201, message: 'Course added successfully', success: true, path };
        } catch (error) {
            throw error;
        }
    };

    async removeCourseFromPath(pathId: string, courseId: string) {
        try {
            let path = await this.findPath(pathId);
            if (!path)
                throw new HttpException('Path not found', HttpStatus.NOT_FOUND);

            const course = path.courses.find(course => course.id.toString() === courseId.toString());
            if (!course)
                throw new HttpException('Course exists in path', HttpStatus.NOT_FOUND);

            path = await this.prisma.paths.update({
                where: { id: pathId },
                data: {
                    total_price: path.total_price - course.price,
                    courses: { disconnect: { id: courseId } }
                },
                include: { courses: { include: { days: true, instructor: true } } }
            });
            return { code: 201, message: 'Course removed successfully', success: true, path };
        } catch (error) {
            throw error;
        }
    };

    async togglePathActivation(pathId: string) {
        try {
            let path = await this.findPath(pathId);
            if (!path)
                throw new HttpException('Path not found', HttpStatus.NOT_FOUND);

            path = await this.prisma.paths.update({
                where: { id: pathId },
                data: { isActive: !path.isActive },
                include: { courses: { include: { days: true, instructor: true } } }
            });
            return { code: 200, message: 'Course status changed', success: true, path };
        } catch (error) {
            throw error;
        }
    };

    async path(slug: string) {
        return await this.prisma.paths.findOne({
            where: { slug },
            include: {
                courses: { include: { days: true, instructor: true } }
            }
        });
    };

    async paths(input: PathPaginationInput) {
        const minPrice = input.priceRange ? { discount_price: { gte: input.priceRange.min } } : {};
        const MaxPrice = input.priceRange ? { discount_price: { lte: input.priceRange.max } } : {};
        const paths = await this.prisma.paths.findMany({
            where: {
                AND: [
                    minPrice,
                    MaxPrice,
                    { name: { contains: input.keyword } },
                    { isActive: { equals: input.isActive } }
                ]
            },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: { courses: { include: { days: true, instructor: true } } }
        });
        const count = await this.prisma.paths.count();
        return { totalCount: count, paths };
    };
}
