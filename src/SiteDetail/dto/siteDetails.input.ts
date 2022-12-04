import { Field, InputType } from 'type-graphql';
import { IsEmail, IsOptional,   IsString } from 'class-validator';

@InputType()
export class SiteDetailsInput {
    @Field({ nullable: true })
    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    number?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    mission?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    vision?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    termsAndConditions?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    privacyAndPolices?: string;
}
