import { ObjectType, Field, registerEnumType } from "type-graphql";
import { Day } from "src/Day/models/day.model";
import { User } from "src/User/models/user.model";
import { Category } from "src/Category/models/category.model";

@ObjectType()
export class Course {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    slug: string;

    @Field()
    description: string;

    @Field()
    requirements: string;

    @Field()
    prerequisites: string;

    @Field(type => [String], { nullable: true })
    deliverables?: string[];

    @Field()
    price: number;

    @Field()
    image: string;

    @Field()
    promoVideo: string;

    @Field()
    totalHours: number;

    @Field(type => [SoftwareUsed])
    softwareUsed: SoftwareUsed[];

    @Field(type => CourseLevel, { nullable: true })
    level?: CourseLevel;

    @Field(type => CourseType)
    type: CourseType;

    @Field(type => CourseReviewStatus)
    status: CourseReviewStatus;

    @Field()
    isActive: boolean;

    @Field(type => [Day])
    days: Day[]

    @Field(type => User)
    instructor: User;

    @Field()
    category: Category;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
};

@ObjectType()
export class SoftwareUsed {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    icon: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
};
 
export enum CourseLevel {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANVED = "ADVANVED"
};
registerEnumType(CourseLevel, { name: 'CourseLevel' });

export enum CourseType {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE'
};
registerEnumType(CourseType, { name: 'CourseType' });

export enum CourseReviewStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
};
registerEnumType(CourseReviewStatus, { name: 'CourseReviewStatus' });

