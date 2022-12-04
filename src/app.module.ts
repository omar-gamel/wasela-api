import { LectureModule } from './Lecture/lecture.module';
import { GraduatesModule } from './Graduates/graduates.module';
import { PubSubModule } from './Share/pubsub/pubsub.module';
import { PlaylistModule } from './FreePlaylist/playlist.module';
import { EventModule } from './Event/event.module';
import { BlogModule } from './Blog/blog.module';
import { WalletModule } from './Wallet/wallet.module';
import { PurchaseModule } from './Purchase/purchase.module';
import { UserEnrollmentModule } from './UserEnrollment/userEnrollment.module';
import { CategoryModule } from './Category/category.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './Auth/auth.module';
import { CartModule } from './Cart/cart.module';
import { CommentModule } from './Comment/comment.module';
import { ContactUsModule } from './ContactUs/contactus.module';
import { CouponModule } from './Coupon/coupon.module';
import { CourseModule } from './Course/course.module';
import { DayModule } from './Day/day.module';
import { GraphqlModule } from './Graphql/graphql.module';
import { NotificationModule } from './Notification/notification.module';
import { OrderModule } from './Order/order.module';
import { PathModule } from './Path/path.module';
import { PrismaModule } from './Prisma/prisma.module';
import { ReviewModule } from './Review/review.module';
import { SiteDetailModule } from './SiteDetail/siteDetail.module';
import { UserModule } from './User/user.module';
import { UserAssignmentModule } from './UserAssignment/userAssignment.module';
import { WishlistModule } from './Wishlist/wishlist.module';
import { UploadModule } from './Upload/upload.module';
import { AssignmentModule } from './Assignment/assignment.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    AssignmentModule,
    LectureModule,
    UploadModule,
    GraduatesModule,
    PubSubModule,
    PlaylistModule,
    EventModule,
    BlogModule,
    WalletModule,
    PurchaseModule,
    UserEnrollmentModule,
    CategoryModule,
    OrderModule,
    UserAssignmentModule,
    CommentModule,
    CouponModule,
    ReviewModule,
    NotificationModule,
    PathModule,
    UserModule,
    CartModule,
    AuthModule,
    CourseModule,
    DayModule,
    WishlistModule,
    ContactUsModule,
    SiteDetailModule,
    GraphqlModule,
    PrismaModule
  ],
  providers: [
    {
      provide: 'PUB_SUB',
      useClass: PubSub
    }
  ],
  exports: ['PUB_SUB'],
})
export class AppModule { }

