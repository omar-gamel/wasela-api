import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { BasicPaginationInput } from 'src/Share/basicPagination.input';
import { PurchasePaginationInput } from './dto/purchasePagination.input';

@Injectable()
export class PurchaseService {
    constructor(private readonly prisma: PrismaService) { }

    async myPurchases(input: BasicPaginationInput, userId: string) {
        return await this.prisma.purchases.findMany({
            where: { user: { id: userId } },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: { user: true, item: { include: { course: true, path: true } } }
        });
    };

    async myPurchase(purchaseId: string, userId: string) {
        const user = await this.prisma.users.findOne({
            where: { id: userId },
            include: { purchases: { include: { user: true, item: { include: { course: true, path: true } } } } }
        });
        return user.purchases.find(purchase => purchase.id.toString() === purchaseId.toString());
    };

    async purchases(input: PurchasePaginationInput) {
        const purchases = await this.prisma.purchases.findMany({
            where: { user: { id: input.userId } },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: { user: true, item: { include: { course: true, path: true } } }
        });
        const count = await this.prisma.purchases.count();
        return { purchases, totalCount: count };
    };

    async purchase(purchaseId: string) {
        return await this.prisma.purchases.findOne({
            where: { id: purchaseId },
            include: { user: true, item: { include: { course: true, path: true } } }
        });
    };
}
