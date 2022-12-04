import { ObjectType, Field } from "type-graphql";
import { Lecture } from "./lecture.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class LectureResponse extends MutationResponse {
    @Field(type => Lecture, { nullable: true })
    lecture?: Lecture;
}
