import { ObjectType, Field } from "type-graphql";
import { Course } from "src/Course/models/course.model";
import { Path } from "src/Path/models/path.model";
import { ItemType } from "./cart.model";
import { Coupon } from "src/Coupon/models/coupon.model";

@ObjectType()
export class CartItem {
    @Field()
    id: string;

    @Field({ nullable: true })
    course?: Course;

    @Field({ nullable: true })
    path?: Path;

    @Field(type => ItemType)
    type: ItemType;

    @Field({ nullable: true })
    coupon?: Coupon;
}



