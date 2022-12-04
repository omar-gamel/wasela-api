import { Field, ObjectType } from 'type-graphql';
import { Faq } from './faq.model';

@ObjectType()
export class SiteDetail {
    @Field()
    id: string;

    @Field(type => [Faq])
    faqs: Faq[];

    @Field({ nullable: true })
    email?: String;

    @Field({ nullable: true })
    number?: String;

    @Field({ nullable: true })
    mission?: String;

    @Field({ nullable: true })
    vision?: String;

    @Field({ nullable: true })
    termsAndConditions?: string;

    @Field({ nullable: true })
    privacyAndPolices?: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}





