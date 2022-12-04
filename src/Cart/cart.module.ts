import { Module } from '@nestjs/common';
import { UserEnrollmentModule } from 'src/UserEnrollment/userEnrollment.module';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { PathModule } from 'src/Path/path.module';
import { CourseModule } from 'src/Course/course.module';

@Module({
    imports: [PrismaModule, UserEnrollmentModule, CourseModule, PathModule],
    providers: [CartService, CartResolver]
})
export class CartModule { }
