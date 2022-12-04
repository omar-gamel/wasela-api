import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { ProviderName } from 'src/User/models/socialAccount.model';

@InputType()
export class SocialAccountInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @Field(type => ProviderName)
  @IsNotEmpty()
  providerName: ProviderName;

  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}

