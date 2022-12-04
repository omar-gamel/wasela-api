import { ObjectType, Field } from "type-graphql";
import { PlaylistItem } from "./playlistItem.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class PlaylistItemResponse extends MutationResponse {
    @Field(type => PlaylistItem, { nullable: true })
    playlistItem?: PlaylistItem;
}
