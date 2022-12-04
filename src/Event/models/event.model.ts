import { ObjectType, Field } from "type-graphql";
import { User } from "src/User/models/user.model";

@ObjectType()
export class Event {
    @Field()
    id: string;

    @Field()
    title: string;

    @Field()
    slug: string;

    @Field()
    description: string;

    @Field()
    image: string;

    @Field()
    startDate: Date;

    @Field()
    endDate: Date;

    @Field()
    place: string;

    @Field()
    isActive: boolean;

    @Field(type => [User])
    interested: User[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}



