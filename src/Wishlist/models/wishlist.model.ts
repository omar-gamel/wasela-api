import { ObjectType, Field } from "type-graphql";
import { User } from "src/User/models/user.model";
import { Path } from "src/Path/models/path.model";
import { Course } from 'src/Course/models/course.model';

@ObjectType()
export class Wishlist {
    @Field()
    id: string;

    @Field(type => User)
    user: User;

    @Field(type => [Course])
    courses: Course[]

    @Field(type => [Course])
    paths: Path[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
