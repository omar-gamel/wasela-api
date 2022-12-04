import { ObjectType, Field, Int } from "type-graphql";
import { Wishlist } from "./wishlist.model";

@ObjectType()
export class WishlistConnection {
    @Field(type => Int)
    totalCount: number;

    @Field(type => [Wishlist])
    wishlists: Wishlist[];
}
