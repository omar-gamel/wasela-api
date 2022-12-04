import { ObjectType, Field } from "type-graphql";
import { Coupon } from "./coupon.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class CouponResponse extends MutationResponse {
    @Field(typr => Coupon, { nullable: true })
    coupon?: Coupon;
}
