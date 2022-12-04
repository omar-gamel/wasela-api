import { ObjectType, Field } from "type-graphql";
import { UserPath } from "./userPath.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class UserPathResponse extends MutationResponse {
    @Field(type => UserPath)
    userPath: UserPath;
};
