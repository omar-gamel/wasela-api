import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { SiteDetailService } from './sitedetail.service';
import { SiteDetailResolver } from './siteDetail.resolver';

@Module({
    imports: [PrismaModule],
    providers: [SiteDetailService, SiteDetailResolver]
})
export class SiteDetailModule { }
