import { ObjectType, Field } from "type-graphql";
import { UserAssignment } from "./userAssignment.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class UserAssignmentResponse extends MutationResponse {
    @Field(type => UserAssignment, { nullable: true })
    userAssignment?: UserAssignment;
}
