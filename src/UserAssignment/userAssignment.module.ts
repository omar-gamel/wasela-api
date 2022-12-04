import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { UserAssignmentService } from './userAssignment.service';
import { UserAssignmentResolver } from './userAssignment.resolver';
import { UserEnrollmentModule } from 'src/UserEnrollment/userEnrollment.module';

@Module({
    imports: [PrismaModule, UserEnrollmentModule],
    providers: [UserAssignmentService, UserAssignmentResolver]
})
export class UserAssignmentModule { }
