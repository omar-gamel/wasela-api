import { Resolver, Mutation, Args, Query, Subscription } from "@nestjs/graphql";
import { UseGuards, Inject } from "@nestjs/common";
import { PubSubEngine } from "type-graphql";
import { CurrentUser } from "src/Common/decorators/currentUser.decorator";
import { CommentPaginationInput } from "./dto/commentPagination.input";
import { CommentConnection } from "./models/commentConnection.model";
import { Roles } from "src/Common/decorators/roles.decorator";
import { LoginGuard } from "src/Common/guards/login.guard";
import { RolesGuard } from "src/Common/guards/roles.guard";
import { CommentResponse } from "./models/commentResponse.model";
import { CommentService } from "./comment.service";
import { Comment } from "./models/comment.model";
import { User } from "src/User/models/user.model";
import { UpdateCommentArgs } from "./dto/updateComment.args";
import { CreateCommentArgs } from "./dto/createComment.args";

@Resolver(of => Comment)
export class CommentResolver {
    constructor(@Inject('PUB_SUB') private readonly pubSub: PubSubEngine, private readonly commentService: CommentService) { }

    @UseGuards(LoginGuard)
    @Mutation(returns => CommentResponse)
    async updateComment(
        @Args() updateCommentArgs: UpdateCommentArgs,
        @CurrentUser('id') userId: string
    ) {
        return await this.commentService.updateComment(updateCommentArgs, userId);
    };

    @UseGuards(LoginGuard)
    @Mutation(returns => CommentResponse)
    async deleteComment(@Args('commentId') commentId: string, @CurrentUser() user: User) {
        return await this.commentService.deleteComment(commentId, user);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Mutation(returns => CommentResponse)
    async toggleCommentActivation(@Args('commentId') commentId: string) {
        return await this.commentService.toggleCommentActivation(commentId);
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('STUDENT', 'INSTRUCTOR')
    @Mutation(returns => CommentResponse)
    async reportComment(@Args('commentId') commentId: string, @CurrentUser() user: User) {
        return await this.commentService.reportComment(commentId, user)
    };

    @UseGuards(LoginGuard, RolesGuard)
    @Roles('ADMIN')
    @Query(returns => CommentConnection)
    async comments(@Args('input') commentPaginationInput: CommentPaginationInput) {
        return await this.commentService.comments(commentPaginationInput);
    };

    // Day  
    @UseGuards(LoginGuard)
    @Mutation(returns => CommentResponse)
    async addDayComment(
        @Args('dayId') dayId: string,
        @Args() createCommentArgs: CreateCommentArgs,
        @CurrentUser() user: User
    ) {
        return await this.commentService.addDayComment(dayId, createCommentArgs, user);
    };

    @Subscription(returns => Comment, {
        filter: (payload, variables) =>
            payload.dayId === variables.dayId
    })
    dayCommentAdded(@Args('dayId') dayId: string) {
        return this.pubSub.asyncIterator('commentAdded');
    };

    // Article 
    @UseGuards(LoginGuard)
    @Mutation(returns => CommentResponse)
    async addArticleComment(
        @Args('articleId') articleId: string,
        @Args() createCommentArgs: CreateCommentArgs,
        @CurrentUser('id') userId: string
    ) {
        return await this.commentService.addArticleComment(articleId, createCommentArgs, userId);
    };

    @Subscription(returns => Comment, {
        filter: (payload, variables) =>
            payload.articleId === variables.articleId
    })
    articleCommentAdded(@Args('articleId') articleId: string) {
        return this.pubSub.asyncIterator('commentAdded');
    };

    // Playlist  
    @UseGuards(LoginGuard)
    @Mutation(returns => CommentResponse)
    async addPlaylistItemComment(
        @CurrentUser('id') userId: string,
        @Args() createCommentArgs: CreateCommentArgs,
        @Args('playlistItemId') playlistItemId: string
    ) {
        return await this.commentService.addPlaylistItemComment(playlistItemId, createCommentArgs, userId);
    };

    @Subscription(returns => Comment, {
        filter: (payload, variables) =>
            payload.playlistItemId === variables.playlistItemId
    })
    playlistItemCommentAdded(@Args('playlistItemId') playlistItemId: string) {
        return this.pubSub.asyncIterator('commentAdded');
    };
}
