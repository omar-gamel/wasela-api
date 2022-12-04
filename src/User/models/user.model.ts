import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { SocialAccount } from './socialAccount.model';
import { UserCourse } from 'src/UserEnrollment/models/userCourse.model';
import { UserPath } from 'src/UserEnrollment/models/userPath.model';
import { Wallet } from 'src/Wallet/wallet.model';
import { Wishlist } from 'src/Wishlist/models/wishlist.model';
import { Purchase } from 'src/Purchase/models/purchase.model';
import { Cart } from 'src/Cart/models/cart.model';
import { Order } from 'src/Order/models/order.model';
import { Event } from 'src/Event/models/event.model';

@ObjectType()
export class User {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    slug?: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    about?: string;

    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    avatar?: string;

    @Field({ nullable: true })
    age?: number;

    @Field(type => Gender, { nullable: true })
    gender?: Gender;

    @Field({ nullable: true })
    country?: string;

    @Field()
    isEmailVerified: boolean;

    @Field()
    isActive: boolean;

    @Field(type => Role, { defaultValue: 'STUDENT' })
    roles: Role;

    @Field(type => Wishlist, { nullable: true })
    wishlist: Wishlist;

    @Field(type => Cart, { nullable: true })
    cart: Cart;

    @Field(type => Wallet, { nullable: true })
    wallet: Wallet;

    @Field(type => [Order])
    orders: Order[];

    @Field(type => [Purchase])
    purchases: Purchase[];

    @Field(type => [Event])
    events: Event[];

    @Field(type => [UserCourse])
    userCourses: UserCourse[];

    @Field(type => [UserPath])
    userPaths: UserPath[];

    @Field(type => [SocialAccount])
    socialAccounts: SocialAccount[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    password: string
};

export enum Role {
    STUDENT = 'STUDENT',
    INSTRUCTOR = 'INSTRUCTOR',
    ADMIN = 'ADMIN'
};

registerEnumType(Role, { name: 'Role' });

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
};

registerEnumType(Gender, { name: 'Gender' });

