import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class ContactUsMessage {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    phone: string;

    @Field()
    message: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
