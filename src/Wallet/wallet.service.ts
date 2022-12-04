import { Injectable } from '@nestjs/common';
import { User } from 'src/User/models/user.model';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class WalletService {
    constructor(private readonly prisma: PrismaService) { }

    async myWallet(userId: string) {
        const instructor = await this.prisma.users.findOne({
            where: { id: userId },
            include: { wallet: { include: { user: true } } }
        });
        return instructor.wallet;
    };
}
