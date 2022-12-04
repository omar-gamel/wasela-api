import { PathService } from './path.service';
import { Module } from '@nestjs/common';
import { PathResolver } from './path.resolver';
import { SlugService } from 'src/Share/slug/slug.service';
import { PrismaModule } from 'src/Prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [PathService, PathResolver, SlugService],
    exports: [PathService]
})
export class PathModule {}
