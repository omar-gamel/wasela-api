import { Resolver, Mutation, Query, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { SiteDetailResponse } from './models/siteDetailResponse.model';
import { SiteDetailsInput } from "./dto/siteDetails.input";
import { LoginGuard } from "src/Common/guards/login.guard";
import { SiteDetail } from "./models/siteDetail.model";
import { EditFaqInput } from "./dto/editFaq.input";
import { AddFaqInput } from "./dto/addFaq.input";
import { Roles } from "src/Common/decorators/roles.decorator";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { SiteDetailService } from "./sitedetail.service";

@Resolver(of => SiteDetail)
export class SiteDetailResolver {
    constructor(private readonly siteService: SiteDetailService) { }

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => SiteDetailResponse)
    async addFaq(@Args('input') addFaqInput: AddFaqInput) {
        return await this.siteService.addFaq(addFaqInput);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => SiteDetailResponse)
    async editFaq(@Args('faqId') faqId: string, @Args('input') editFaqInput: EditFaqInput) {
        return await this.siteService.editFaq(faqId, editFaqInput);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => SiteDetailResponse)
    async deleteFaq(@Args('faqId') faqId: string) {
        return await this.siteService.deleteFaq(faqId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => SiteDetailResponse)
    async addOrEditSiteDetails(@Args('input') siteDetailsInput: SiteDetailsInput) {
        return await this.siteService.addOrEditSiteDetails(siteDetailsInput);
    };

    @Query(returns => SiteDetail, { nullable: true })
    async siteDetails() {
        return await this.siteService.siteDetails();
    };
}
