import { ObjectType, Field } from "type-graphql";
import { Graduates } from "./graduates.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class GraduatesResponse extends MutationResponse {
    @Field(type => Graduates, { nullable: true })
    graduated?: Graduates;
}

