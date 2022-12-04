import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class Faq {
    @Field()
    id: string;

    @Field(type => Int)
    rank: number;

    @Field()
    question: String;

    @Field()
    answer: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}




