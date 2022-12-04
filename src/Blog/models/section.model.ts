import { ObjectType, Field } from "type-graphql";
import { Article } from "./article.model";

@ObjectType()
export class Section {
    @Field()
    id: string;

    @Field()
    title: string;

    @Field()
    slug: string;

    @Field()
    description: string;

    @Field()
    isActive: boolean;

    @Field(type => [Article])
    articles: Article[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

