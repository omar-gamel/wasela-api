import { ObjectType, Field } from "type-graphql";
import { Playlist } from "./playlist.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class PlaylistResponse extends MutationResponse {
    @Field(type => Playlist, { nullable: true })
    playlist?: Playlist;
}
