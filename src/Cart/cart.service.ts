import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { AddToCartArgs } from './dto/addToCart.args';
import { UserEnrollmentService } from 'src/UserEnrollment/userEnrollment.service';
import { PathService } from 'src/Path/path.service';
import { CourseService } from 'src/Course/course.service';

@Injectable()
export class CartService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly courseService: CourseService,
        private readonly pathService: PathService,
        private readonly userEnrollmentService: UserEnrollmentService
    ) { }

    async addToCart(input: AddToCartArgs, userId: string) {
        try {
            if (input.itemType === 'COURSE') {
                const userCourse = await this.userEnrollmentService.findUserCourse(input.itemId, userId);
                if (userCourse)
                    throw new HttpException('You already have valid enrollment in this course', HttpStatus.BAD_REQUEST);
            }
            if (input.itemType === 'PATH') {
                const userPath = await this.userEnrollmentService.findUserPath(input.itemId, userId);
                if (userPath)
                    throw new HttpException('You already enrolled in this path', HttpStatus.BAD_REQUEST);
            }
            let cart = await this.myCart(userId);
            if (!cart) {
                if (input.itemType === 'COURSE') {
                    const course = await this.courseService.findCourse(input.itemId);
                    if (!course)
                        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);

                    cart = await this.prisma.carts.create({
                        data: {
                            user: { connect: { id: userId } },
                            totoalQty: 1,
                            totalPrice: course.price,
                            items: { create: { type: 'COURSE', course: { connect: { id: input.itemId } } } },
                        },
                        include: { items: { include: { course: true, path: true, coupon: true } } }
                    });
                    return { code: 200, message: 'Item added to your cart', success: true, cart };
                }
                if (input.itemType === 'PATH') {
                    const path = await this.pathService.findPath(input.itemId);
                    if (!path)
                        throw new HttpException('Path not found', HttpStatus.NOT_FOUND);

                    cart = await this.prisma.carts.create({
                        data: {
                            user: { connect: { id: userId } },
                            totoalQty: 1,
                            totalPrice: path.discount_price,
                            items: { create: { type: 'PATH', path: { connect: { id: input.itemId } } } },
                        },
                        include: { items: { include: { course: true, path: true, coupon: true } } }
                    });
                    return { code: 200, message: 'Item added to your cart', success: true, cart };
                }
            } else {
                let items = cart.items;
                if (input.itemType === 'COURSE') {
                    const exists = items.some(item => {
                        return item.type === 'COURSE' && item.course && item.course.id.toString() === input.itemId.toString()
                    });
                    if (exists)
                        return { code: 200, message: 'Item already in your cart', success: false, cart };

                    const course = await this.courseService.findCourse(input.itemId);
                    if (!course)
                        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);

                    cart = await this.prisma.carts.update({
                        where: { id: cart.id },
                        data: {
                            totoalQty: ++cart.totoalQty,
                            totalPrice: cart.totalPrice + course.price,
                            items: { create: { type: 'COURSE', course: { connect: { id: input.itemId } } } }
                        },
                        include: { items: { include: { course: true, path: true, coupon: true } } }
                    });
                    return { code: 200, message: 'Item added to your cart', success: true, cart };
                }
                if (input.itemType === 'PATH') {
                    const exists = items.some(item => {
                        return item.type === 'PATH' && item.path && item.path.id.toString() === input.itemId.toString()
                    });
                    if (exists)
                        return { code: 200, message: 'Item already in your cart', success: false, cart };

                    const path = await this.pathService.findPath(input.itemId);
                    if (!path)
                        throw new HttpException('Path not found', HttpStatus.NOT_FOUND);

                    cart = await this.prisma.carts.update({
                        where: { id: cart.id },
                        data: {
                            totoalQty: ++cart.totoalQty,
                            totalPrice: cart.totalPrice + path.discount_price,
                            items: { create: { type: 'PATH', path: { connect: { id: input.itemId } } } }
                        },
                        include: { items: { include: { course: true, path: true, coupon: true } } }
                    });
                    return { code: 200, message: 'Item added to your cart', success: true, cart };
                }
            }
        } catch (error) {
            throw error;
        }
    };

    async removeFromCart(itemId: string, userId: string) {
        try {
            let cart = await this.myCart(userId);
            if (!cart)
                throw new HttpException('No cart found', HttpStatus.NOT_FOUND);

            const item = cart.items.find(item => item.id.toString() === itemId.toString());
            if (!item)
                throw new HttpException('Item not found', HttpStatus.NOT_FOUND);

            let itemPrice;
            if (item.type === 'COURSE') {
                itemPrice = item.course.price;
            } else {
                itemPrice = item.path.discount_price;
            }
            cart = await this.prisma.carts.update({
                where: { id: cart.id },
                data: {
                    items: {
                        delete: { id: itemId }
                    },
                    totoalQty: --cart.totoalQty,
                    totalPrice: cart.totalPrice - itemPrice
                },
                include: { items: { include: { course: true, path: true, coupon: true } } }
            });
            return { code: 200, message: 'Item deleted successfully', success: true, cart };
        } catch (error) {
            throw error;
        }
    };

    async clearCart(userId: string) {
        try {
            let cart = await this.myCart(userId);
            if (!cart)
                return { code: 200, message: 'Cart is Empty', success: false, cart: null };

            cart = await this.prisma.carts.update({
                where: { id: cart.id },
                data: {
                    totoalQty: 0,
                    totalPrice: 0,
                    items: { deleteMany: {} }
                },
                include: {
                    items: { include: { course: true, path: true, coupon: true } }
                }
            });
            return { code: 200, message: 'Cart Items deleted successfully', success: true };
        } catch (error) {
            throw error;
        }
    };

    async applyCoupon(code: string, userId: string) {
        try {
            let cart = await this.myCart(userId);
            if (!cart)
                throw new HttpException('No cart found', HttpStatus.NOT_FOUND);

            const coupon = await this.prisma.coupons.findOne({
                where: { code: code },
                include: { courses: true, paths: true }
            });
            if ((!coupon || !coupon.isActive || coupon.noUse === coupon.original_noUse))
                throw new HttpException('Invalid coupon code', HttpStatus.NOT_FOUND);

            if (new Date(coupon.endDate) < new Date(Date.now()))
                throw new HttpException('expired coupon', HttpStatus.BAD_REQUEST);

            if (new Date(coupon.startDate) > new Date(Date.now()))
                throw new HttpException('coupon will be valid soon', HttpStatus.BAD_REQUEST)

            const items = cart.items;
            let index = -1;
            if (coupon.type === 'COURSES') {
                index = items.findIndex(item => {
                    if (item.type === 'COURSE')
                        return !!coupon.courses.find(course => course.id.toString() === item.course.id.toString())
                });
            } else {
                index = items.findIndex(item => {
                    if (item.type === 'PATH')
                        return !!coupon.paths.find(path => path.id.toString() === item.path.id.toString())
                });
            }
            if (index < 0)
                throw new HttpException('No courses or paths exist in your cart for this coupon', HttpStatus.BAD_REQUEST);

            const item_coupon_id = items[index].coupon ? items[index].coupon.id : null;
            if (item_coupon_id !== coupon.id)
                await this.prisma.coupons.update({ where: { id: coupon.id }, data: { noUse: ++coupon.noUse } });

            await this.prisma.cartItems.update({
                where: { id: items[index].id },
                data: { coupon: { connect: { id: coupon.id } } }
            });
            cart = await this.prisma.carts.findOne({
                where: { id: cart.id },
                include: { items: { include: { course: true, path: true, coupon: true } } }
            });
            return { code: 200, message: 'Coupon applied', success: true, cart };
        } catch (error) {
            throw error;
        }
    };

    async myCart(userId: string) {
        const user = await this.prisma.users.findOne({
            where: { id: userId },
            include: {
                cart: { include: { items: { include: { course: true, path: true, coupon: true } } } }
            }
        });
        return user.cart;
    };
}

