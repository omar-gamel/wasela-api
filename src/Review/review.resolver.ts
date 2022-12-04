import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { ReviewPaginationInput } from "./dto/reviewPaginationInput.input";
import { Review } from "./models/review.model";
import { ReviewService } from "./review.service";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { Roles } from "src/Common/decorators/roles.decorator";
import { ReviewResponse } from './models/reviewResponse.model';
import { CreateCourseReviewInput } from "./dto/createCourseReview.input";
import { UpdateCourseReviewInput } from "./dto/updateCourseReview.input";
import { Response } from "src/Share/response.model";

@Resolver(of => Review)
export class ReviewResolver {
    constructor(private readonly reviewService: ReviewService) { }

    @UseGuards(LoginGuard)
    @Mutation(returns => ReviewResponse)
    async submitCourseReview(@Args('input') createCourseReviewInput: CreateCourseReviewInput, @CurrentUser('id') userId: string) {
        return await this.reviewService.submitCourseReview(createCourseReviewInput, userId);
    };

    @UseGuards(LoginGuard)
    @Mutation(returns => ReviewResponse)
    async updateReview(
        @Args('reviewId') reviewId: string,
        @Args('input') updateCourseReviewInput: UpdateCourseReviewInput,
        @CurrentUser('id') userId: string
    ) {
        return await this.reviewService.updateReview(reviewId, updateCourseReviewInput, userId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => Response)
    async deleteReview(@Args('reviewId') reviewId: string) {
        return await this.reviewService.deleteReview(reviewId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => ReviewResponse)
    async toggleReviewActivation(@Args('reviewId') reviewId: string) {
        return await this.reviewService.toggleReviewActivation(reviewId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('STUDENT', 'INSTRUCTOR')
    @Mutation(returns => ReviewResponse)
    async reportCourseReview(@Args('reviewId') reviewId: string, @CurrentUser('id') userId: string) {
        return await this.reviewService.reportCourseReview(reviewId, userId);
    };

    @Query(returns => Review, { nullable: true })
    async review(@Args('reviewId') reviewId: string) {
        return await this.reviewService.review(reviewId);
    };

    @Query(returns => [Review])
    async reviews(@Args('input') reviewPaginationInput: ReviewPaginationInput) {
        return await this.reviewService.reviews(reviewPaginationInput);
    };

    @UseGuards(LoginGuard)
    @Query(returns => Review, { nullable: true })
    async myReview(@Args('courseId') courseId: string, @CurrentUser('id') userId: string) {
        return await this.reviewService.myReview(courseId, userId);
    };

    @UseGuards(LoginGuard)
    @Query(returns => [Review])
    async myReviews(@CurrentUser('id') userId: string) {
        return await this.reviewService.myReviews(userId);
    };
}
