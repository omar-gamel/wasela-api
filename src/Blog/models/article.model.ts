import { ObjectType, Field } from "type-graphql";
import { User } from "src/User/models/user.model";
import { Comment } from "src/Comment/models/comment.model";

@ObjectType()
export class Article {
    @Field()
    id: string;

    @Field()
    image: string;

    @Field()
    text: string;

    @Field(type => [User])
    likes: User[];

    @Field(type => [Comment])
    comments: Comment[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

