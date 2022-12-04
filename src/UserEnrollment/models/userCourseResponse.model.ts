import { ObjectType, Field } from "type-graphql";
import { UserCourse } from "./userCourse.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class UserCourseResponse extends MutationResponse {
    @Field(type => UserCourse, { nullable: true })
    userCourse?: UserCourse;
};
