import { Module } from '@nestjs/common';
import { UserEnrollmentService } from './userEnrollment.service';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { UserEnrollmentResolver } from './userEnrollment.resolver';

@Module({
    imports: [PrismaModule],
    providers: [UserEnrollmentService, UserEnrollmentResolver],
    exports: [UserEnrollmentService]
})
export class UserEnrollmentModule {}
