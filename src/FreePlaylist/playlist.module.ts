import { Module } from '@nestjs/common';
import { SlugService } from 'src/Share/slug/slug.service';
import { PlaylistService } from './playlist.service';
import { PlaylistResolver } from './playlist.resolver';
import { PrismaModule } from 'src/Prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [PlaylistService, PlaylistResolver, SlugService]
})
export class PlaylistModule { }
