import { Module } from '@nestjs/common';
import { ContactUsService } from './contactus.service';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { ContactUsResolver } from './contactus.resolver';

@Module({
    imports: [PrismaModule],
    providers: [ContactUsService, ContactUsResolver]
})
export class ContactUsModule { }
