import { ObjectType, Field } from "type-graphql";
import { Course } from "src/Course/models/course.model";

@ObjectType()
export class Path {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    slug: string;

    @Field()
    description: string;

    @Field()
    total_price: number;

    @Field()
    discount_price: number;

    @Field()
    image: string;

    @Field()
    isActive: boolean;

    @Field(type => [Course])
    courses: Course[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
} 
