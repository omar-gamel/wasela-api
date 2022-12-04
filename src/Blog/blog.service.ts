import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SlugService } from 'src/Share/slug/slug.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CreateSectionArgs } from './dto/createSection.args';
import { UpdateSectionArgs } from './dto/updateSection.args';
import { CreateArticleArgs } from './dto/createArticle.args';
import { SectionPaginationInput } from './dto/sectionPagination.input';

@Injectable()
export class BlogService {
    constructor(private readonly prisma: PrismaService, private readonly slugService: SlugService) { }

    private async findBlogSection(id: string) {
        return await this.prisma.sections.findOne({
            where: { id },
            include: { articles: { include: { comments: { include: { author: true } } } } }
        });
    };

    async addBlogSection(args: CreateSectionArgs) {
        try {
            const section = await this.prisma.sections.create({
                data: {
                    ...args,
                    slug: await this.slugService.generateSlug(args.title)
                },
                include: { articles: { include: { comments: { include: { author: true } } } } }
            });
            return { code: 200, message: 'Section added successfully', success: true, section };
        } catch (error) {
            throw error;
        }
    };

    async updateBlogSection(args: UpdateSectionArgs) {
        try {
            let section = await this.findBlogSection(args.sectionId);
            if (!section)
                throw new HttpException('Section not found', HttpStatus.NOT_FOUND);

            section = await this.prisma.sections.update({
                where: { id: args.sectionId },
                data: {
                    title: args.title,
                    description: args.description,
                    slug: args.title ? await this.slugService.generateSlug(args.title) : section.slug
                },
                include: { articles: { include: { comments: { include: { author: true } } } } }
            });
            return { code: 200, message: 'Section updated successfully', success: true, section };
        } catch (error) {
            throw error;
        }
    };

    async toggleBlogSectionActivation(sectionId: string) {
        try {
            let section = await this.findBlogSection(sectionId);
            if (!section)
                throw new HttpException('Section not found', HttpStatus.NOT_FOUND);

            section = await this.prisma.sections.update({
                where: { id: sectionId },
                data: { isActive: !section.isActive },
                include: { articles: { include: { comments: { include: { author: true } } } } }
            });
            return { code: 200, message: 'Section updated successfully', success: true, section };
        } catch (error) {
            throw error;
        }
    };

    async addBlogSectionArticle(args: CreateArticleArgs) {
        try {
            let section = await this.findBlogSection(args.sectionId);
            if (!section)
                throw new HttpException('Section not found', HttpStatus.NOT_FOUND);

            section = await this.prisma.sections.update({
                where: { id: args.sectionId },
                data: {
                    articles: {
                        create: {
                            text: args.text,
                            image: args.image
                        }
                    }
                },
                include: { articles: { include: { comments: { include: { author: true } } } } }
            });
            return { code: 200, message: 'Article added successfully', success: true, section };
        } catch (error) {
            throw error;
        }
    };

    async blogSections(input: SectionPaginationInput) {
        return await this.prisma.sections({
            where: {
                AND: [
                    { isActive: input.isActive },
                    { title: { contains: input.keyword } }
                ]
            },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: { articles: { include: { comments: { include: { author: true } } } } }
        });
    };

    async blogSection(slug: string) {
        return await this.prisma.sections.findOne({
            where: { slug },
            include: { articles: { include: { comments: { include: { author: true } } } } }
        });
    };
}
