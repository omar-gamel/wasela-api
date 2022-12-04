import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Roles } from "src/Common/decorators/roles.decorator";
import { GraduatesService } from "./graduates.service";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { GraduatesResponse } from './models/graduatesResponse.model';
import { Graduates } from "./models/graduates.model";

@Resolver(of => Graduates)
export class GraduatesResolver {
    constructor(private graduatesService: GraduatesService) { }

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => GraduatesResponse)
    async addGraduated(@Args('studentId') studentId: string) {
        return await this.graduatesService.addGraduated(studentId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => GraduatesResponse)
    async removeGraduated(@Args('studentId') studentId: string) {
        return await this.graduatesService.removeGraduated(studentId);
    };

    @Query(returns => [Graduates])
    async graduates() {
        return await this.graduatesService.graduates();
    };
}

