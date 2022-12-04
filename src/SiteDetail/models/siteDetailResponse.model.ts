import { ObjectType, Field } from "type-graphql";
import { MutationResponse } from "src/Share/mutationResponse.model";
import { SiteDetail } from "./siteDetail.model";

@ObjectType({ implements: MutationResponse })
export class SiteDetailResponse extends MutationResponse {
    @Field(type => SiteDetail, { nullable: true })
    siteDetail?: SiteDetail;
}
