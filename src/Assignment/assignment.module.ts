import { Module } from '@nestjs/common';
import { DayModule } from 'src/Day/day.module';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { AssignmentService } from './assignment.service';
import { AssignmentResolver } from './assignment.resolver';

@Module({
    imports: [PrismaModule, DayModule],
    providers: [AssignmentService, AssignmentResolver]
})
export class AssignmentModule {}
