import { ObjectType, Field } from "type-graphql";
import { Path } from "./path.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class PathResponse extends MutationResponse {
    @Field(type => Path, { nullable: true })
    path?: Path;
}
