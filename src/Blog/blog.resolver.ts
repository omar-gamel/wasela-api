import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Roles } from "src/Common/decorators/roles.decorator";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { BlogService } from "./blog.service";
import { CreateArticleArgs } from "./dto/createArticle.args";
import { CreateSectionArgs } from "./dto/createSection.args";
import { UpdateSectionArgs } from "./dto/updateSection.args";
import { Section } from "./models/section.model";
import { SectionResponse } from './models/sectionResponse.model';
import { SectionPaginationInput } from "./dto/sectionPagination.input";

@Resolver()
export class BlogResolver {
    constructor(private readonly blogService: BlogService) { }

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => SectionResponse)
    async addBlogSection(@Args() createSectionArgs: CreateSectionArgs) {
        return await this.blogService.addBlogSection(createSectionArgs);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => SectionResponse)
    async updateBlogSection(@Args() updateSectionArgs: UpdateSectionArgs) {
        return await this.blogService.updateBlogSection(updateSectionArgs);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => SectionResponse)
    async toggleBlogSectionActivation(@Args('sectionId') sectionId: string) {
        return await this.blogService.toggleBlogSectionActivation(sectionId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => SectionResponse)
    async addBlogSectionArticle(@Args() createArticleArgs: CreateArticleArgs) {
        return await this.blogService.addBlogSectionArticle(createArticleArgs);
    };

    @Query(returns => [Section])
    async blogSections(@Args('input') sectionPaginationInput: SectionPaginationInput) {
        return await this.blogService.blogSections(sectionPaginationInput);
    };

    @Query(returns => Section, { nullable: true })
    async blogSection(@Args('slug') slug: string) {
        return await this.blogService.blogSection(slug);
    };
}

