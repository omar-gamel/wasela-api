import { ObjectType, Field } from "type-graphql";
import { User } from "src/User/models/user.model";

@ObjectType()
export class NotificationRecipient {
    @Field()
    id: string;

    @Field(type => User)
    user: User;

    @Field()
    isSeen: boolean;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

