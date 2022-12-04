import { ObjectType, Field } from "type-graphql";
import { Section } from "./section.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class SectionResponse extends MutationResponse {
    @Field(type => Section, { nullable: true })
    section?: Section;
}

