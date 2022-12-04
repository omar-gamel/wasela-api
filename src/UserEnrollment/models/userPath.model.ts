import { ObjectType, Field, Int } from "type-graphql";
import { User } from "src/User/models/user.model";
import { Path } from "src/Path/models/path.model";
import { Lecture } from "src/Lecture/models/lecture.model";

@ObjectType()
export class UserPath {
    @Field()
    id: string;

    @Field(type => User)
    user: User;

    @Field(type => Path)
    path: Path;

    @Field(type => Int)
    progress: number;

    @Field(type => [Lecture])
    watchedLectures: Lecture[]; 

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

