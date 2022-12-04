import { IsEmail, IsNotEmpty, MinLength, IsString, IsNumber, IsPositive } from 'class-validator';
import { InputType, Field, Int } from 'type-graphql';
import { Gender } from 'src/User/models/user.model';

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  avatar: string;

  @Field(type => Gender)
  @IsNotEmpty()
  gender: Gender;

  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  age: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  country: string;

  slug: string;
}
