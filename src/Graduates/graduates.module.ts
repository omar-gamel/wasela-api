import { Module } from '@nestjs/common';
import { GraduatesService } from './graduates.service';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { GraduatesResolver } from './graduates.resolver';

@Module({
    imports: [PrismaModule],
    providers: [GraduatesService, GraduatesResolver]
})
export class GraduatesModule { }
