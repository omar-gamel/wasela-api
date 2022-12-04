import { ObjectType, Field } from "type-graphql";
import { MutationResponse } from "src/Share/mutationResponse.model";
import { User } from "./user.model";

@ObjectType({ implements: MutationResponse })
export class UserResponse extends MutationResponse {
    @Field()
    user: User;
}
