import { ObjectType } from "type-graphql";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class Response extends MutationResponse {}