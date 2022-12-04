import { ObjectType, Field, Int } from "type-graphql";
import { User } from "src/User/models/user.model";
import { Comment } from "src/Comment/models/comment.model";

@ObjectType()
export class PlaylistItem {
    @Field()
    id: string;

    @Field(type => Int)
    rank: number;

    @Field()
    title: string;

    @Field()
    link: string; 

    @Field(type => [User])
    likes: User[];

    @Field(type => [Comment])
    comments: Comment[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}


