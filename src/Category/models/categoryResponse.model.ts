import { ObjectType, Field } from "type-graphql";
import { Category } from "./category.model";
import { MutationResponse } from "src/Share/mutationResponse.model";

@ObjectType({ implements: MutationResponse })
export class CategoryResponse extends MutationResponse {
    @Field(type => Category, { nullable: true })
    category?: Category;
}
