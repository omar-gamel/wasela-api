import { ObjectType, Field } from "type-graphql";
import { User } from "src/User/models/user.model";

@ObjectType()
export class Graduates {
    @Field()
    id: string;

    @Field(type => User)
    student: User;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

