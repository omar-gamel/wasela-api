import { ObjectType, Field, registerEnumType, Int } from "type-graphql";
import { User } from "src/User/models/user.model";
import { Path } from "src/Path/models/path.model";
import { Course } from "src/Course/models/course.model";

@ObjectType()
export class Coupon {
    @Field()
    id: string;

    @Field()
    code: string;

    @Field()
    isPercent: boolean;

    @Field()
    amount: number;

    @Field()
    startDate: Date;

    @Field()
    endDate: Date;

    @Field()
    isActive: boolean;

    @Field(type => User)
    user: User;

    @Field(type => [Course])
    courses: Course;

    @Field(type => [Path])
    paths: Path;

    @Field(type => Int)
    original_noUse: number;
    
    @Field(type => Int)
    noUse: number;

    @Field(type => CouponAppliedType)
    type: CouponAppliedType;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
};

export enum CouponAppliedType {
    COURSES = 'COURSES',
    PATHS = 'PATHS'
};
registerEnumType(CouponAppliedType, { name: 'CouponAppliedType' });

