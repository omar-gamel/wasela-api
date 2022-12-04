import { ObjectType, Field } from "type-graphql";
import { MutationResponse } from "src/Share/mutationResponse.model";
import { Auth } from "./auth.model";

@ObjectType({ implements: MutationResponse })
export class AuthResponse extends Auth {}
