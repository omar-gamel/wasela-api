import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { EventPaginationInput } from "./dto/eventPagination.input";
import { Roles } from "src/Common/decorators/roles.decorator";
import { EventResponse } from "./models/eventResponse.model";
import { Event } from "./models/event.model";
import { EventService } from "./event.service";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { CreateEventInput } from "./dto/createEvent.input";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";

@Resolver(of => Event)
export class EventResolver {
    constructor(private eventService: EventService) { }

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => EventResponse)
    async addEvent(@Args('input') createEventInput: CreateEventInput) {
        return await this.eventService.addEvent(createEventInput)
    };

    @UseGuards(LoginGuard)
    @Mutation(returns => EventResponse)
    async eventRememberMe(@Args('eventId') eventId: string, @CurrentUser('id') userId: string) {
        return await this.eventService.eventRememberMe(eventId, userId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => EventResponse)
    async toggleEventActivation(@Args('eventId') eventId: string) {
        return this.eventService.toggleEventActivation(eventId);
    };

    @Query(returns => [Event])
    async events(@Args('input') eventPaginationInput: EventPaginationInput) {
        return await this.eventService.events(eventPaginationInput);
    };

    @Query(returns => Event, { nullable: true })
    async event(@Args('slug') slug: string) {
        return await this.eventService.event(slug);
    };
}

