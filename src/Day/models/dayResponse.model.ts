import { ObjectType, Field } from "type-graphql";
import { Day } from "./day.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class DayResponse extends MutationResponse {
    @Field(type => Day, { nullable: true })
    day?: Day;
}
