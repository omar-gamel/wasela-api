import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SlugService } from 'src/Share/slug/slug.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { UpdatePlaylistInput } from './dto/updatePlaylist.input';
import { UpdatePlaylistItemInput } from './dto/updatePlaylistItem.input';
import { CreatePlaylistInput } from './dto/createPlaylist.input';
import { PlaylistPaginationInput } from './dto/playlistPagination.input';
import { CreatePlaylistItemInput } from './dto/createplaylistItem.input';

@Injectable()
export class PlaylistService {
    constructor(private readonly prisma: PrismaService, private readonly slugService: SlugService) { }

    private async findPlaylist(id: string) {
        return await this.prisma.playlists.findOne({
            where: { id },
            include: { items: { include: { comments: { include: { author: true } }, likes: true } } }
        });
    };

    private async findPlaylistItem(id: string) {
        return await this.prisma.playlistItems.findOne({
            where: { id },
            include: { comments: { include: { author: true } }, likes: true, playlist: true }
        });
    };

    async addFreePlaylist(input: CreatePlaylistInput) {
        try {
            const playlist = await this.prisma.playlists.create({
                data: {
                    ...input,
                    items: { create: [...input.items] },
                    slug: await this.slugService.generateSlug(input.name),
                },
                include: { items: { include: { comments: { include: { author: true } }, likes: true } } }
            });
            return { code: 201, message: 'Playlist created successfully', success: true, playlist };
        } catch (error) {
            throw error;
        }
    };

    async updateFreePlaylistInfo(playlistId: string, input: UpdatePlaylistInput) {
        try {
            let playlist = await this.findPlaylist(playlistId);
            if (!playlist)
                throw new HttpException('Playlist not found', HttpStatus.NOT_FOUND);

            if (input.name)
                input.slug = await this.slugService.generateSlug(input.name);

            playlist = await this.prisma.playlists.update({
                where: { id: playlistId },
                data: { ...input },
                include: { items: { include: { comments: { include: { author: true } }, likes: true } } }
            });
            return { code: 201, message: 'Playlist updated successfully', success: true, playlist };
        } catch (error) {
            throw error;
        }
    };

    async toggleFreePlaylistActivation(playlistId: string) {
        try {
            let playlist = await this.findPlaylist(playlistId);
            if (!playlist)
                throw new HttpException('Playlist not found', HttpStatus.NOT_FOUND);

            playlist = await this.prisma.playlists.update({
                where: { id: playlistId },
                data: { isActive: !playlist.isActive },
                include: { items: { include: { comments: { include: { author: true } }, likes: true } } }
            });
            return { code: 200, message: 'Playlist status changed', success: true, playlist };
        } catch (error) {
            throw error;
        }
    };

    async addFreePlaylistItem(playlistId: string, input: CreatePlaylistItemInput) {
        try {
            let playlist = await this.findPlaylist(playlistId);
            if (!playlist)
                throw new HttpException('Playlist not found', HttpStatus.NOT_FOUND);

            const playlistItem = await this.prisma.playlistItems.create({
                data: {
                    ...input,
                    playlist: { connect: { id: playlistId } }
                },
                include: { comments: { include: { author: true } }, likes: true, playlist: true }
            });
            return { code: 201, message: 'Playlist updated successfully', success: true, playlistItem };
        } catch (error) {
            throw error;
        }
    };

    async updateFreePlaylistItem(playlistItemId: string, input: UpdatePlaylistItemInput) {
        try {
            let playlistItem = await this.findPlaylistItem(playlistItemId);
            if (!playlistItem)
                throw new HttpException('Playlist Item not found', HttpStatus.NOT_FOUND);

            playlistItem = await this.prisma.playlistItems.update({
                where: { id: playlistItemId },
                data: { ...input },
                include: { comments: { include: { author: true } }, likes: true, playlist: true }
            });
            return { code: 201, message: 'Playlist item updated successfully', success: true, playlistItem };
        } catch (error) {
            throw error;
        }
    };

    async deleteFreePlaylistItem(playlistItemId: string) {
        try {
            const playlistItem = await this.findPlaylistItem(playlistItemId);
            if (!playlistItem)
                throw new HttpException('Playlist Item not found', HttpStatus.NOT_FOUND);

            await this.prisma.playlistItems.delete({ where: { id: playlistItemId } });
            return { code: 200, message: 'Playlist item deleted successfully', success: true };
        } catch (error) {
            throw error;
        }
    }; 

    async addFreePlaylistItemLikeAction(playlistItemId: string, userId: string) {
        try {
            let playlistItem = await this.findPlaylistItem(playlistItemId);
            if (!playlistItem)
                throw new HttpException('Playlist Item not found', HttpStatus.NOT_FOUND);

            const likes = playlistItem.likes;
            if (!likes.length || likes.some(user => user.id.toString() !== userId.toString())) {
                playlistItem = await this.prisma.playlistItems.update({
                    where: { id: playlistItemId },
                    data: { likes: { connect: { id: userId } } },
                    include: { comments: { include: { author: true } }, likes: true, playlist: true }
                });
            }
            return { code: 200, message: 'Playlist item updated successfully', success: true, playlistItem };
        } catch (error) {
            throw error;
        }
    };

    async playlist(slug: string) {
        return await this.prisma.playlists.findOne({
            where: { slug },
            include: { items: { include: { comments: { include: { author: true } }, likes: true } } }
        });
    };

    async playlists(input: PlaylistPaginationInput) {
        return await this.prisma.playlists({
            where: { isActive: input.isActive },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: { items: { include: { comments: { include: { author: true } }, likes: true } } }
        });
    };
}
