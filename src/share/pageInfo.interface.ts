import { InterfaceType, Field, Int } from "type-graphql";

@InterfaceType()
export class PageInfo {
    @Field(type=> Int)
    perPage: number;

    @Field(type=> Int)
    currentPage: number;

    @Field(type=> Int)
    pageCount: number;

    @Field(type=> Int)
    totalCount: number;
}



