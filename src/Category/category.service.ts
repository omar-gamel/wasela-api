import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CategoryPaginationInput } from './dto/categoryPagination.input';
import { CreateCategoryInput } from './dto/createCategory.input';
import { UpdateCategoryInput } from './dto/updateCategory.input';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) { }

    async findCategoryById(id: string) {
        return await this.prisma.categories.findOne({ where: { id }, include: { courses: true } });
    };

    private async findCategoryByName(name: string) {
        return await this.prisma.categories.findOne({ where: { name }, include: { courses: true } });
    };

    async addCategory(input: CreateCategoryInput) {
        try {
            let category = await this.findCategoryByName(input.name);
            if (category)
                throw new HttpException('Category already exist', HttpStatus.BAD_REQUEST);

            input.slug = slugify(input.name, { replacement: '-', remove: null, lower: true });
            category = await this.prisma.categories.create({
                data: { ...input },
                include: { courses: true }
            });
            return { code: 201, message: 'Category created successfully', success: true, category };
        } catch (error) {
            throw error;
        }
    };

    async updateCategory(categoryId: string, input: UpdateCategoryInput) {
        try {
            let category = await this.findCategoryById(categoryId);
            if (!category)
                throw new HttpException('No category found', HttpStatus.NOT_FOUND);

            if (input.name) {
                category = await this.findCategoryByName(input.name);
                if (category && category.id !== categoryId)
                    throw new HttpException('Category already exist', HttpStatus.BAD_REQUEST);

                input.slug = slugify(input.name, { replacement: '-', remove: null, lower: true });
            }
            category = await this.prisma.categories.update({
                where: { id: categoryId },
                data: { ...input },
                include: { courses: true }
            });
            return { code: 200, message: 'Category updated successfully', success: true, category };
        } catch (error) {
            throw error;
        }
    };

    async toggleCategoryActivation(categoryId: string, ) {
        try {
            let category = await this.findCategoryById(categoryId);
            if (!category)
                throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

            category = await this.prisma.categories.update({
                where: { id: categoryId },
                data: { isActive: !category.isActive },
                include: { courses: true }
            });
            return { code: 200, message: 'Category updated successfully', success: true, category };
        } catch (error) {
            throw error;
        }
    };

    async categories(input: CategoryPaginationInput) {
        return await this.prisma.categories.findMany({
            where: {
                AND: [
                    { isActive: input.isActive },
                    { name: { contains: input.keyword } }
                ]
            },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: { courses: true }
        });
    };

    async category(slug: string) {
        return await this.prisma.categories.findOne({ where: { slug }, include: { courses: true } });
    };
}
