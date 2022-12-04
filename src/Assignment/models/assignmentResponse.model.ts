import { ObjectType, Field } from "type-graphql";
import { Assignment } from "./assignment.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class AssignmentResponse extends MutationResponse {
    @Field(type => Assignment)
    assignment: Assignment;
}
