import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AuthResponse } from "./models/authResponse.model";
import { RegisterInput } from "./dto/register.input";
import { LoginArgs } from "./dto/login.args";
import { AuthService } from "./auth.service";
import { Auth } from "./models/auth.model";
import { ResetPasswordInput } from "./dto/resetPassword.input";
import { SocialAccountInput } from './dto/socialAccount.input';
import { VerifyUserArgs } from "./dto/verifyUser.args";
import { Response } from 'src/Share/response.model'; 
import { UsePipes } from "@nestjs/common";
import { PhoneNumberValidationPipe } from "src/Common/pipes/phoneNumberValidation.pipe";

@Resolver(of => Auth)
export class AuthResolver {
    constructor(private readonly auth: AuthService) { }

    @UsePipes(PhoneNumberValidationPipe)
    @Mutation(returns => AuthResponse)
    async register(@Args('input') registerInput: RegisterInput) {
        return await this.auth.register(registerInput);
    };

    @UsePipes(PhoneNumberValidationPipe)
    @Mutation(returns => AuthResponse)
    async createInstructor(@Args('input') registerInput: RegisterInput) {
        return await this.auth.createInstructor(registerInput);
    };

    @Mutation(returns => AuthResponse)
    async login(@Args() loginArgs: LoginArgs) { 
        return await this.auth.login(loginArgs);
    };

    @Mutation(returns => Response)
    async resendVerificationMail(@Args('email') email: string) {
        return await this.auth.sendConfirmationMail(email);
    };

    @Mutation(returns => AuthResponse)
    async verifyUser(@Args() verifyUserArgs: VerifyUserArgs) {
        return await this.auth.verifyUser(verifyUserArgs);
    };

    @Mutation(returns => Response)
    async requestResetPassword(@Args('email') email: string) {
        return await this.auth.sendRestPassword(email);
    };

    @Mutation(returns => AuthResponse)
    async resetPassword(@Args('input') resetPasswordInput: ResetPasswordInput) {
        return await this.auth.resetPassword(resetPasswordInput);
    };

    @Mutation(returns => AuthResponse)
    async socialLoginOrRegister(@Args('input') socialAccountInput: SocialAccountInput) {
        return await this.auth.socialLoginOrRegister(socialAccountInput);
    };
}
