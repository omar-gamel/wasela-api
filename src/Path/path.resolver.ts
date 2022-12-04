import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Roles } from "src/Common/decorators/roles.decorator";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { CreatePathInput } from "./dto/createPath.input";
import { PathPaginationInput } from "./dto/PathPagination.input";
import { UpdatePathInput } from "./dto/updatePath.input";
import { Path } from "./models/path.model";
import { PathConnection } from "./models/pathConnection.model";
import { PathResponse } from "./models/pathResponse.model";
import { PathService } from "./path.service";

@Resolver(of => Path)
export class PathResolver {
    constructor(private readonly pathService: PathService) { }

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => PathResponse)
    async createPath(@Args('input') createPathInput: CreatePathInput) {
        return await this.pathService.createPath(createPathInput);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => PathResponse)
    async updatePathInfo(@Args('pathId') pathId: string, @Args('input') updatePathInput: UpdatePathInput) {
        return await this.pathService.updatePathInfo(pathId, updatePathInput);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => PathResponse)
    async addCourseToPath(@Args('pathId') pathId: string, @Args('courseId') courseId: string) {
        return await this.pathService.addCourseToPath(pathId, courseId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => PathResponse)
    async removeCourseFromPath(@Args('pathId') pathId: string, @Args('courseId') courseId: string) {
        return await this.pathService.removeCourseFromPath(pathId, courseId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => PathResponse)
    async togglePathActivation(@Args('pathId') pathId: string) {
        return await this.pathService.togglePathActivation(pathId);
    };

    @Query(returns => Path, { nullable: true })
    async path(@Args('slug') slug: string) {
        return this.pathService.path(slug);
    };

    @Query(returns => PathConnection)
    async paths(@Args('input') pathPaginationInput: PathPaginationInput) {
        return this.pathService.paths(pathPaginationInput);
    };
}
