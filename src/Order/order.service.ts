import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderPaginationInput } from './dto/orderPagination.input';
import { BasicPaginationInput } from 'src/Share/basicPagination.input';
import { PrismaService } from 'src/Prisma/prisma.service';
import { NotificationType } from 'src/Notification/models/notification.model';
import { NotificationService } from 'src/Notification/notification.service';
import * as cron from 'node-cron';
import * as  moment from 'moment';
import { CheckoutInput } from './dto/checkout.input';

@Injectable()
export class OrderService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationService
    ) { }

    private async startUserCourseSchedule(userCourseId: string) {
        const userCourse = await this.prisma.userCourses.findOne({
            where: { id: userCourseId },
            include: { user: true, course: { include: { days: true } } }
        });
        const days = await this.prisma.days.findMany({ where: { course: { id: userCourse.course.id } }, orderBy: { rank: 'asc' } });
        const userId = userCourse.user.id;
        const courseId = userCourse.course.id;
        if (days.length) {
            await this.prisma.days.update({
                where: { id: days[0].id },
                data: { availableFor: { connect: { id: userId } } }
            });
        }
        const startDate = new Date(userCourse.createdAt);
        const task = cron.schedule('* 1 * * *', async () => {
            const today = new Date(Date.now());
            const diff = moment(today).diff(startDate, 'days');
            for (let dayIndex = 0; dayIndex <= diff && days.length > dayIndex; dayIndex++) {
                const course = await this.prisma.courses.update({
                    where: { id: courseId },
                    data: {
                        days: {
                            update: {
                                where: { id: days[dayIndex].id },
                                data: { availableFor: { connect: { id: userId } } }
                            }
                        }
                    },
                    include: { days: { include: { availableFor: true } } }
                });
                const availableDaysForUser = course.days.filter(day => {
                    return day.availableFor.some(user => user.id.toString() === userId.toString())
                });
                if (days.length === availableDaysForUser.length) {
                    task.stop();
                    return;
                }
            }
        });
        task.start();
    };

    private async startUserPathSchedule(userPathId: string) {
        const userPath = await this.prisma.userPaths.findOne({
            where: { id: userPathId },
            include: { user: true, path: { include: { courses: { include: { days: true } } } } }
        });
        const userId = userPath.user.id;
        const days = [];
        for (const course of userPath.path.courses) {
            const courseDays = await this.prisma.days.findMany({ where: { course: { id: course.id } }, orderBy: { rank: 'asc' } })
            days.push(...courseDays);
        }
        if (days.length) {
            await this.prisma.days.update({
                where: { id: days[0].id },
                data: { availableFor: { connect: { id: userId } } }
            });
        }
        const startDate = new Date(userPath.createdAt);
        const task = cron.schedule('* 1  * * *', async () => {
            const today = new Date(Date.now());
            const diff = moment(today).diff(startDate, 'days');
            for (let dayIndex = 0; dayIndex <= diff && days.length > dayIndex; dayIndex++) {
                await this.prisma.days.update({
                    where: { id: days[dayIndex].id },
                    data: { availableFor: { connect: { id: userId } } }
                });
                const path = await this.prisma.paths.findOne({
                    where: { id: userPath.path.id },
                    include: { courses: { include: { days: { include: { availableFor: true } } } } }
                });
                const availableDaysForUser = [];
                for (const course of path.courses) {
                    for (const day of course.days) {
                        const exist = day.availableFor.find(user => user.id.toString() === userId.toString());
                        if (exist)
                            availableDaysForUser.push(day)
                    }
                }
                if (days.length === availableDaysForUser.length) {
                    task.stop();
                    return;
                }
            }
        });
        task.start();
    };

    private async finalizeOrder(orderId: string) {
        const order = await this.prisma.orders.findOne({
            where: { id: orderId },
            include: {
                user: true,
                items: {
                    include: {
                        course: { include: { instructor: true, days: true } },
                        path: { include: { courses: { include: { instructor: true, days: true } } } }
                    }
                }
            }
        });
        let orderItems = order.items;
        let purchases = [];
        for (const orderItem of orderItems) {
            let purchase;
            if (orderItem.type === 'COURSE') {
                purchase = await this.prisma.purchases.create({
                    data: {
                        user: { connect: { id: order.user.id } },
                        item: {
                            create: {
                                type: 'COURSE',
                                course: { connect: { id: orderItem.course.id } },
                            }
                        },
                        price: orderItem.price,
                        paymentMethod: order.paymentMethod
                    },
                    include: { user: true, item: { include: { course: true, path: true } } }
                });
                // Create User Course Enrollment
                if (orderItem.course.type !== 'OFFLINE') {
                    const userCourse = await this.prisma.userCourses.create({
                        data: {
                            user: { connect: { id: order.user.id } },
                            course: { connect: { id: orderItem.course.id } },
                        }
                    });
                    await this.startUserCourseSchedule(userCourse.id);
                }
            } else {
                purchase = await this.prisma.purchases.create({
                    data: {
                        user: { connect: { id: order.user.id } },
                        item: {
                            create: {
                                type: 'PATH',
                                path: { connect: { id: orderItem.path.id } },
                            }
                        },
                        price: orderItem.price,
                        paymentMethod: order.paymentMethod
                    },
                    include: { user: true, item: { include: { course: true, path: true } } }
                });
                // Create User Path Enrollment 
                const userPath = await this.prisma.userPaths.create({
                    data: {
                        user: { connect: { id: order.user.id } },
                        path: { connect: { id: orderItem.path.id } }
                    }
                });
                await this.startUserPathSchedule(userPath.id);
            };
            purchases.push(purchase);

            // Crate Course Instructor Wellet
            if (orderItem.type === 'COURSE') {
                const instructor = await this.prisma.users.findOne({
                    where: { id: orderItem.course.instructor.id },
                    include: { wallet: true }
                });
                if (!instructor.wallet) {
                    await this.prisma.wallets.create({
                        data: {
                            balance: (orderItem.price * 80) / 100,
                            user: { connect: { id: instructor.id } }
                        }
                    });
                } else {
                    await this.prisma.wallets.update({
                        where: { id: instructor.wallet.id },
                        data: {
                            balance: instructor.wallet.balance + ((orderItem.price * 80) / 100)
                        }
                    });
                }
                await this.notificationService.fireNewNotification({
                    message: `  ${orderItem.course.name} تم شراء كورس ${order.user.name} الطالب `,
                    to: [instructor.id],
                    type: NotificationType.PURCHASE
                });
            } else {
                for (const course of orderItem.path.courses) {
                    const instructor = await this.prisma.users.findOne({
                        where: { id: course.instructor.id },
                        include: { wallet: true }
                    });
                    if (!instructor.wallet) {
                        await this.prisma.wallets.create({
                            data: {
                                balance: (course.price * 80) / 100,
                                user: { connect: { id: instructor.id } }
                            }
                        });
                    } else {
                        await this.prisma.wallets.update({
                            where: { id: instructor.wallet.id },
                            data: {
                                balance: instructor.wallet.balance + ((course.price * 80) / 100)
                            }
                        });
                    }
                    await this.notificationService.fireNewNotification({
                        message: ` ${orderItem.path.name} من خﻻل المسار  ${course.name} تم شراء كورس ${order.user.name} الطالب `,
                        to: [instructor.id],
                        type: NotificationType.PURCHASE
                    });
                }
            }
        }
        return purchases;
    };

    private async calculateOrder(cartItems) {
        let totalPrice = 0;
        let subTotalPrice = 0;
        for (const cartItem of cartItems) {
            if (!cartItem.coupon) {
                if (cartItem.type === 'COURSE') {
                    totalPrice += cartItem.course.price;
                    subTotalPrice += cartItem.course.price;
                } else {
                    totalPrice += cartItem.path.total_price;
                    subTotalPrice += cartItem.path.discount_price;
                }
            } else {
                const coupon = cartItem.coupon;
                if (coupon.isPercent) {
                    if (cartItem.type === 'COURSE') {
                        let price = cartItem.course.price - ((coupon.amount * cartItem.course.price) / 100);
                        totalPrice += cartItem.course.price;
                        subTotalPrice += price;
                    } else {
                        let price = cartItem.path.discount_price - ((coupon.amount * cartItem.path.discount_price) / 100);
                        totalPrice += cartItem.path.total_price;
                        subTotalPrice += price;
                    }
                } else {
                    if (cartItem.type === 'COURSE') {
                        let price = cartItem.course.price - coupon.amount;
                        totalPrice += cartItem.course.price;
                        subTotalPrice += price;
                    } else {
                        let price = cartItem.path.discount_price - coupon.amount;
                        totalPrice += cartItem.path.total_price;
                        subTotalPrice += price;
                    }
                }
            }
        }
        return { totalPrice, subTotalPrice };
    };

    async checkout(input: CheckoutInput, userId: string) {
        try {
            const user = await this.prisma.users.findOne({
                where: { id: userId },
                include: {
                    cart: { include: { items: { include: { course: true, path: true, coupon: true } } } }
                }
            });
            let cart = user.cart;
            if (!cart || !cart.items.length)
                throw new HttpException('No items found for checkout', HttpStatus.NOT_FOUND);

            const cartItems = cart.items;
            const { totalPrice, subTotalPrice } = await this.calculateOrder(cartItems);
            let order_items = [];
            cartItems.forEach(item => {
                if (item.type === 'COURSE') {
                    order_items.push({
                        type: 'COURSE',
                        price: item.course.price,
                        course: { connect: { id: item.course.id } },
                        coupon: { connect: item.coupon ? { id: item.coupon.id } : undefined }
                    });
                } else {
                    order_items.push({
                        type: 'PATH',
                        price: item.path.discount_price,
                        path: { connect: { id: item.path.id } },
                        coupon: { connect: item.coupon ? { id: item.coupon.id } : undefined }
                    });
                }
            });
            const orderCount = await this.prisma.orders.count();
            const order = await this.prisma.orders.create({
                data: {
                    ...input,
                    orderNumber: 1000 + orderCount,
                    items: { create: [...order_items] },
                    user: { connect: { id: user.id } },
                    totalPrice,
                    subTotalPrice,
                },
                include: {
                    user: true,
                    items: { include: { course: { include: { days: { include: { availableFor: true, lectures: true } } } }, path: true, coupon: true } }
                }
            });
            await this.prisma.carts.update({
                where: { id: cart.id },
                data: {
                    totoalQty: 0,
                    totalPrice: 0,
                    items: { deleteMany: {} }
                }
            });

            // Create User Purchases
            const purchases = await this.finalizeOrder(order.id);
            if (!purchases.length)
                throw new Error('Something un expected happened');

            return { code: 201, message: 'Order created successfully', success: true, order };
        } catch (error) {
            throw error;
        }
    };


    async myOrders(input: BasicPaginationInput, userId: string) {
        return await this.prisma.orders.findMany({
            where: { user: { id: userId } },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: { user: true, items: { include: { course: true, path: true, coupon: true } } }
        });
    };

    async myOrder(orderId: string, userId: string) {
        const user = await this.prisma.users.findOne({
            where: { id: userId },
            include: {
                orders: {
                    include: {
                        user: true,
                        items: { include: { course: true, path: true, coupon: true } }
                    }
                }
            }
        });
        return user.orders.find(order => order.id.toString() === orderId.toString());
    };

    async orders(input: OrderPaginationInput) {
        const orders = await this.prisma.orders.findMany({
            where: { user: { id: input.userId } },
            skip: input.skip,
            first: input.first,
            after: input.after,
            before: input.after,
            orderBy: { createdAt: input.orderBy },
            include: { user: true, items: { include: { course: true, path: true, coupon: true } } }
        });
        const count = await this.prisma.orders.count();
        return { totalCount: count, orders };
    };

    async order(orderId: string) {
        return await this.prisma.orders.findOne({
            where: { id: orderId },
            include: { user: true, items: { include: { course: true, path: true, coupon: true } } }
        });
    };
}

