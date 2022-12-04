import { ObjectType, Field } from "type-graphql";
import { User } from "src/User/models/user.model";

@ObjectType()
export class Wallet {
    @Field()
    id: string;

    @Field(type => User)
    user: User; 

    @Field()
    balance: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}