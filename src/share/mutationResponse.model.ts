import { InterfaceType, Field } from "type-graphql";

@InterfaceType()
export class MutationResponse {
    @Field()
    code: String;

    @Field()
    success: Boolean;

    @Field()
    message: String;
}


// @InterfaceType()
// export class MutationResponse<T> {
//   @Field()
//   code: String;

//   @Field()
//   success: Boolean;

//   @Field()
//   message: String;

//   @Field()
//   data: T;
// }