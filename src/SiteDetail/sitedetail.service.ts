import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SiteDetailsInput } from './dto/siteDetails.input';
import { EditFaqInput } from './dto/editFaq.input';
import { AddFaqInput } from './dto/addFaq.input';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class SiteDetailService {
    constructor(private readonly prisma: PrismaService) { }

    private async findFaq(id: string) {
        return await this.prisma.faqs.findOne({ where: { id } });
    };

    private async findSiteDetail() {
        const siteDetail = await this.prisma.siteDetails.findMany({ include: { faqs: true } });
        return siteDetail[0];
    };

    async addFaq(input: AddFaqInput) {
        try {
            let siteDetail = await this.findSiteDetail();
            if (!siteDetail) {
                siteDetail = await this.prisma.siteDetails.create({
                    data: {
                        faqs: { create: { ...input } }
                    },
                    include: { faqs: true }
                });
            } else {
                siteDetail = await this.prisma.siteDetails.update({
                    where: { id: siteDetail.id },
                    data: {
                        faqs: { create: { ...input } }
                    },
                    include: { faqs: true }
                });
            }
            return { code: 201, message: 'FAQ added successfully', success: true, siteDetail };
        } catch (error) {
            throw error;
        }
    };

    async editFaq(faqId: string, input: EditFaqInput) {
        try {
            const faq = await this.findFaq(faqId);
            if (!faq)
                throw new HttpException('FAQ can not be found', HttpStatus.NOT_FOUND);

            await this.prisma.faqs.update({
                where: { id: faqId },
                data: { ...input }
            });
            const siteDetail = await this.findSiteDetail();
            return { code: 200, message: 'FAQ updated successfully', success: true, siteDetail };
        } catch (error) {
            throw error;
        }
    };

    async deleteFaq(faqId: string) {
        try {
            const faq = await this.findFaq(faqId);
            if (!faq)
                throw new HttpException('FAQ can not be found', HttpStatus.NOT_FOUND);

            await this.prisma.faqs.delete({ where: { id: faqId } });
            const siteDetail = await this.findSiteDetail();
            return { code: 200, message: 'FAQ deleted successfully', success: true, siteDetail };
        } catch (error) {
            throw error;
        }
    };

    async addOrEditSiteDetails(input: SiteDetailsInput) {
        try {
            let siteDetail = await this.findSiteDetail();
            if (!siteDetail) {
                siteDetail = await this.prisma.siteDetails.create({
                    data: { ...input },
                    include: { faqs: true }
                });
            } else {
                siteDetail = await this.prisma.siteDetails.update({
                    where: { id: siteDetail.id },
                    data: { ...input },
                    include: { faqs: true }
                });
            }
            return { code: 201, message: 'Operation done successfully', success: true, siteDetail };
        } catch (error) {
            throw error;
        }
    };

    async siteDetails() {
        return this.findSiteDetail();
    };
}