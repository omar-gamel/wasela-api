import { ObjectType, Field } from "type-graphql";
import { ContactUsMessage } from "./contactUsMessage.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class ContactUsMessageResponse extends MutationResponse {
    @Field(type => ContactUsMessage, { nullable: true })
    contactUsMessage?: ContactUsMessage;
}
