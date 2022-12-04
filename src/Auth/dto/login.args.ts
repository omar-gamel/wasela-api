import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Field, ArgsType } from 'type-graphql';

@ArgsType()
export class LoginArgs {
  @Field()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}
