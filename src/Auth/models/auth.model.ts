import { Field, ObjectType } from 'type-graphql';
import { User } from 'src/User/models/user.model';

@ObjectType()
export class Auth {
  @Field({ nullable: true })
  token?: string;

  @Field(type => User, { nullable: true })
  user?: User;
}
