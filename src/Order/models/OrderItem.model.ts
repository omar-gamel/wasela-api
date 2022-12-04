import { ObjectType, Field } from "type-graphql";
import { Path } from "src/Path/models/path.model";
import { ItemType } from "src/Cart/models/cart.model";
import { Coupon } from "src/Coupon/models/coupon.model";
import { Course } from "src/Course/models/course.model";

@ObjectType()
export class OrderItem {
    @Field()
    id: string;

    @Field()
    price: number;

    @Field({ nullable: true })
    course?: Course;

    @Field({ nullable: true })
    path?: Path;

    @Field(type => ItemType)
    type: ItemType;

    @Field({ nullable: true })
    coupon?: Coupon;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}


