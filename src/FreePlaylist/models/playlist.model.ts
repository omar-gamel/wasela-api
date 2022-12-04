import { ObjectType, Field } from "type-graphql";
import { PlaylistItem } from "./playlistItem.model";

@ObjectType()
export class Playlist {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    slug: string;

    @Field()
    description: string;

    @Field()
    image: string;

    @Field()
    isActive: boolean;

    @Field(type => [PlaylistItem])
    items: PlaylistItem[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}





