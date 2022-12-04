import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Category {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    slug: string;

    @Field()
    description: string;

    @Field()
    icon: string;

    @Field()
    isActive: boolean;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

