import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { Roles } from "src/Common/decorators/roles.decorator";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { CreatePlaylistInput } from "./dto/createPlaylist.input";
import { PlaylistPaginationInput } from "./dto/playlistPagination.input";
import { UpdatePlaylistInput } from "./dto/updatePlaylist.input";
import { UpdatePlaylistItemInput } from "./dto/updatePlaylistItem.input";
import { Playlist } from "./models/playlist.model";
import { PlaylistItemResponse } from "./models/playlistItemResponse.model";
import { PlaylistResponse } from "./models/playlistResponse.model";
import { PlaylistService } from "./playlist.service";
import { CreatePlaylistItemInput } from "./dto/createplaylistItem.input";
import { Response } from "src/Share/response.model";

@Resolver(of => Playlist)
export class PlaylistResolver {
    constructor(private readonly playlistService: PlaylistService) { }

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => PlaylistResponse)
    async addFreePlaylist(@Args('input') createPlaylistInput: CreatePlaylistInput) {
        return await this.playlistService.addFreePlaylist(createPlaylistInput);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => PlaylistResponse)
    async updateFreePlaylistInfo(@Args('playlistId') playlistId: string, @Args('input') updatePlaylistInput: UpdatePlaylistInput) {
        return await this.playlistService.updateFreePlaylistInfo(playlistId, updatePlaylistInput);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => PlaylistResponse)
    async toggleFreePlaylistActivation(@Args('playlistId') playlistId: string) {
        return await this.playlistService.toggleFreePlaylistActivation(playlistId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => PlaylistItemResponse)
    async addFreePlaylistItem(@Args('playlistId') playlistId: string, @Args('input') createPlaylistItemInput: CreatePlaylistItemInput) {
        return await this.playlistService.addFreePlaylistItem(playlistId, createPlaylistItemInput);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => PlaylistItemResponse)
    async updateFreePlaylistItem(@Args('playlistItemId') playlistItemId: string, @Args('input') updatePlaylistItemInput: UpdatePlaylistItemInput) {
        return await this.playlistService.updateFreePlaylistItem(playlistItemId, updatePlaylistItemInput);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => Response)
    async deleteFreePlaylistItem(@Args('playlistItemId') playlistItemId: string) {
        return await this.playlistService.deleteFreePlaylistItem(playlistItemId);
    };

    @UseGuards(LoginGuard)
    @Mutation(returns => PlaylistItemResponse)
    async addFreePlaylistItemLikeAction(@Args('playlistItemId') playlistItemId: string, @CurrentUser('id') userId: string) {
        return await this.playlistService.addFreePlaylistItemLikeAction(playlistItemId, userId);
    };

    @Query(returns => [Playlist])
    async playlists(@Args('input') playlistPaginationInput: PlaylistPaginationInput) {
        return await this.playlistService.playlists(playlistPaginationInput);
    };

    @Query(returns => Playlist, { nullable: true })
    async playlist(@Args('slug') slug: string) {
        return await this.playlistService.playlist(slug);
    };
}


