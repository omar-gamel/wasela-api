import { ObjectType, Field } from "type-graphql";
import { Course } from "src/Course/models/course.model";
import { Path } from "src/Path/models/path.model";
import { ItemType } from "src/Cart/models/cart.model";

@ObjectType()
export class PurchaseItem {
    @Field()
    id: string;

    @Field(type => ItemType)
    type: ItemType;

    @Field(type => Course, { nullable: true })
    course?: Course;

    @Field(type => Path, { nullable: true })
    path?: Path;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
