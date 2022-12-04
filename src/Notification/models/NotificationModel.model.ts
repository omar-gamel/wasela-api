import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class NotificationModel {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    slug: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

 