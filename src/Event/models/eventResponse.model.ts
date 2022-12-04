import { ObjectType, Field } from "type-graphql";
import { Event } from './event.model';
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class EventResponse extends MutationResponse {
    @Field(type => Event, { nullable: true })
    event?: Event;
}
