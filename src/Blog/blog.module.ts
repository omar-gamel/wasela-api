import { Module } from '@nestjs/common';
import { SlugService } from 'src/Share/slug/slug.service';
import { BlogResolver } from './blog.resolver';
import { BlogService } from './blog.service';
import { PrismaModule } from 'src/Prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [BlogService, BlogResolver, SlugService]
})
export class BlogModule { }
