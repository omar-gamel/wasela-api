import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Roles } from "src/Common/decorators/roles.decorator";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { CategoryService } from "./category.service";
import { CategoryPaginationInput } from "./dto/categoryPagination.input";
import { CreateCategoryInput } from "./dto/createCategory.input";
import { UpdateCategoryInput } from "./dto/updateCategory.input";
import { Category } from "./models/category.model";
import { CategoryResponse } from "./models/categoryResponse.model";

@Resolver(of => Category)
export class CategoryResolver {
    constructor(private readonly categoryService: CategoryService) { }

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => CategoryResponse)
    async addCategory(@Args('input') createCategoryInput: CreateCategoryInput) {
        return await this.categoryService.addCategory(createCategoryInput);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => CategoryResponse)
    async updateCategory(@Args('categoryId') categoryId: string, @Args('input') updateCategoryInput: UpdateCategoryInput) {
        return await this.categoryService.updateCategory(categoryId, updateCategoryInput);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => CategoryResponse)
    async toggleCategoryActivation(@Args('categoryId') categoryId: string) {
        return await this.categoryService.toggleCategoryActivation(categoryId);
    };

    @Query(returns => [Category])
    async categories(@Args('input') categoryPaginationInput: CategoryPaginationInput) {
        return await this.categoryService.categories(categoryPaginationInput);
    };

    @Query(returns => Category, { nullable: true })
    async category(@Args('slug') slug: string) {
        return await this.categoryService.category(slug);
    };
}
