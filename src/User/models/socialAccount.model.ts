import { Field, ObjectType, registerEnumType } from 'type-graphql';

@ObjectType()
export class SocialAccount {
    @Field()
    id: string;

    @Field()
    providerId: string;

    @Field(type => ProviderName)
    providerName: ProviderName;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
};

export enum ProviderName {
    GMAIL = 'GMAIL',
    FACEBOOK = 'FACEBOOK',
    TWITTER = 'TWITTER'
}

registerEnumType(ProviderName, { name: 'ProviderName' });

