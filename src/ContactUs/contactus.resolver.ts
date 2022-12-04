import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ContactUsService } from "./contactus.service";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { Roles } from "src/Common/decorators/roles.decorator";
import { ContactUsMessage } from "./models/contactUsMessage.model";
import { CreateContactUsMessageInput } from "./dto/createContactUsMessage.input";
import { ContactUsMessageResponse } from "./models/contactUsMessageResponse.model";

@Resolver(of => ContactUsMessage)
export class ContactUsResolver {
    constructor(private readonly contactUsService: ContactUsService) { }

    @Mutation(returns => ContactUsMessageResponse)
    async createContactUsMessage(@Args('input') createContactUsMessageInput: CreateContactUsMessageInput) {
        return await this.contactUsService.createContactUsMessage(createContactUsMessageInput);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => ContactUsMessageResponse)
    async deleteContactUsMessage(@Args('messageId') messageId: string) {
        return await this.contactUsService.deleteContactUsMessage(messageId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Query(returns => ContactUsMessage, { nullable: true })
    async contactUsMessage(@Args('messageId') messageId: string) {
        return await this.contactUsService.contactUsMessage(messageId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Query(returns => [ContactUsMessage])
    async contactUsMessages() {
        return await this.contactUsService.contactUsMessages();
    };
}
