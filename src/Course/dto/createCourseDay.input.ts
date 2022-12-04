import { InputType, Field } from "type-graphql";
import { ArrayMinSize, IsArray, IsOptional } from "class-validator";
import { CreateDayInput } from "src/Day/dto/createDay.input";
import { CreateLectureInput } from "src/Lecture/dto/createLecture.input";
import { CreateAssignmentInput } from "src/Assignment/dto/createAssignment.input";

@InputType()
export class CreateCourseDayInput extends CreateDayInput {
    @Field(type => [CreateLectureInput])
    @IsArray()
    @ArrayMinSize(1)
    lectures: CreateLectureInput[];
    
    @Field(type => [CreateAssignmentInput], { nullable: true })
    @IsArray()
    @IsOptional()
    @ArrayMinSize(1)
    assignments?: CreateAssignmentInput[];
}
