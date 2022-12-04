import { ObjectType, Field } from "type-graphql";
import { Course } from "./course.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class CourseResponse extends MutationResponse {
    @Field(type => Course, { nullable: true })
    course?: Course;
}
