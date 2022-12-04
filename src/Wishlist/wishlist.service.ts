import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { WishlistPaginationInput } from './dto/wishlistPagination.input';

@Injectable()
export class WishlistService {
    constructor(private readonly prisma: PrismaService) { }

    async courseAddToOrRemoveFromWishlist(courseId: string, userId: string) {
        try {
            const course = await this.prisma.courses.findOne({ where: { id: courseId } });
            if (!course)
                throw new HttpException('Course not found', HttpStatus.NOT_FOUND);

            const user = await this.prisma.users.findOne({
                where: { id: userId },
                include: { wishlist: { include: { courses: true, paths: true, user: true } } }
            });
            let wishlist = user.wishlist;
            if (!wishlist) {
                wishlist = await this.prisma.wishlists.create({
                    data: {
                        user: { connect: { id: user.id } },
                        courses: { connect: { id: courseId } }
                    },
                    include: { courses: true, paths: true, user: true }
                });
            } else {
                const index = wishlist.courses.findIndex(course => course.id.toString() === courseId.toString());
                if (index < 0) {
                    wishlist = await this.prisma.wishlists.update({
                        where: { id: wishlist.id },
                        data: { courses: { connect: { id: courseId } } },
                        include: { courses: true, paths: true, user: true }
                    });
                } else {
                    wishlist = await this.prisma.wishlists.update({
                        where: { id: wishlist.id },
                        data: { courses: { disconnect: { id: courseId } } },
                        include: { courses: true, paths: true, user: true }
                    });
                }
            }
            return { code: 200, message: 'Operation done successfully', success: true, wishlist };
        } catch (error) {
            throw error;
        }
    };

    async pathAddToOrRemoveFromWishlist(pathId: string, userId: string) {
        try {
            const path = await this.prisma.paths.findOne({ where: { id: pathId } });
            if (!path)
                throw new HttpException('Path not found', HttpStatus.NOT_FOUND);

            const user = await this.prisma.users.findOne({
                where: { id: userId },
                include: { wishlist: { include: { courses: true, paths: true, user: true } } }
            });
            let wishlist = user.wishlist;
            if (!wishlist) {
                wishlist = await this.prisma.wishlists.create({
                    data: {
                        user: { connect: { id: user.id } },
                        paths: { connect: { id: pathId } }
                    },
                    include: { courses: true, paths: true, user: true }
                });
            } else {
                const index = wishlist.paths.findIndex(path => path.id.toString() === pathId.toString());
                if (index < 0) {
                    wishlist = await this.prisma.wishlists.update({
                        where: { id: wishlist.id },
                        data: { paths: { connect: { id: pathId } } },
                        include: { courses: true, paths: true, user: true }
                    });
                } else {
                    wishlist = await this.prisma.wishlists.update({
                        where: { id: wishlist.id },
                        data: { paths: { disconnect: { id: pathId } } },
                        include: { courses: true, paths: true, user: true }
                    });
                }
            }
            return { code: 200, message: 'Operation done successfully', success: true, wishlist };
        } catch (error) {
            throw error;
        }
    };

    async myWishlist(userId: string) {
        const user = await this.prisma.users.findOne({
            where: { id: userId },
            include: { wishlist: { include: { courses: true, paths: true, user: true } } }
        });
        return user.wishlist;
    };

    async wishlist(wishlistId: string) {
        return this.prisma.wishlists.findOne({
            where: { id: wishlistId },
            include: { user: true, courses: true, paths: true }
        });
    };

    async wishlists(input: WishlistPaginationInput) {
        const wishlists = await this.prisma.wishlists.findMany({
            where: { user: { id: input.userId } },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: { user: true, courses: true, paths: true }
        });
        const count = await this.prisma.wishlists.count();
        return { totalCount: count, wishlists };
    };
}
