import { Field, Int, ObjectType } from "type-graphql";
import { Path } from "./path.model";

@ObjectType()
export class PathConnection {
    @Field(type => Int)
    totalCount: number;

    @Field(type => [Path])
    paths: Path[];
}
