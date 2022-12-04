import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CreateContactUsMessageInput } from './dto/createContactUsMessage.input';

@Injectable()
export class ContactUsService {
    constructor(private readonly prisma: PrismaService) { }

    private async findContactUsMessage(id: string) {
        return await this.prisma.contactUsMessages.findOne({ where: { id } });
    };

    async createContactUsMessage(input: CreateContactUsMessageInput) {
        try {
            const message = await this.prisma.contactUsMessages.create({ data: { ...input } });
            return { code: 201, message: 'Message created successfully', success: true, contactUsMessage: message };
        } catch (error) {
            throw error;
        }
    };

    async deleteContactUsMessage(messageId: string) {
        try {
            const message = await this.findContactUsMessage(messageId);
            if (!message)
                throw new HttpException('Message not found', HttpStatus.NOT_FOUND);

            await this.prisma.contactUsMessages.delete({ where: { id: messageId } });
            return { code: 200, message: 'Message deleted successfully', success: true, contactUsMessage: message };
        } catch (error) {
            throw error;
        }
    };

    async contactUsMessage(messageId: string) {
        return await this.findContactUsMessage(messageId);
    };

    async contactUsMessages() {
        return await this.prisma.contactUsMessages.findMany();
    };
}
