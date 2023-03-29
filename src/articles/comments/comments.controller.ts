import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserDocument } from 'src/users/user.schema';
import { Protect } from 'src/utils/decorator/auth.decorator';
import { ConnectedUser } from 'src/utils/decorator/customAuth.decorator';
import { ApiPaginatedDto } from 'src/utils/tools/dto/api-pagined-dto.decorator';
import { PaginationOptionsDto } from 'src/utils/tools/dto/request/pagination-options.dto';
import { ArticleDocument } from '../article.schema';
import { ArticleByIdPipe } from '../utils/article.pipe';
import { CommentDocument } from './comment.schema';
import { CommentService } from './comments.service';
import { CreateCommentaryDto } from './dto/request/create-commentary.dto';
import { GetCommentaryDto } from './dto/response/get-commentary.dto';
import { CommentByIdPipe } from './utils/comment.pipe';

@ApiTags('Comments')
@Controller('/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

  @Protect()
  @Get(':articleId')
  @ApiOperation({ summary: 'Get comments paginated from article ID' })
  @ApiParam({ name: 'articleId', type: String })
  @ApiPaginatedDto(GetCommentaryDto)
  getArticleCommentsPaginated(
    @Param('articleId', ArticleByIdPipe) article: ArticleDocument,
    @Query() paginationOptionDto: PaginationOptionsDto,
  ) {
    return this.commentService.getArticleComments(article, paginationOptionDto);
  }

  @Protect()
  @Post(':articleId')
  @ApiParam({ name: 'articleId', type: String })
  @ApiOperation({ summary: 'Add comment to post' })
  @ApiOkResponse({ type: GetCommentaryDto })
  addComment(
    @Param('articleId', ArticleByIdPipe) article: ArticleDocument,
    @Body() createCommentaryDto: CreateCommentaryDto,
    @ConnectedUser() user: UserDocument,
  ) {
    return this.commentService.addComment(user, createCommentaryDto, article);
  }

  @Protect()
  @Delete(':commentId')
  @ApiParam({ name: 'commentId', type: String })
  @ApiOperation({ summary: 'Delete Comment by CommentId' })
  @ApiNoContentResponse({ description: 'SUCCESS' })
  removeComment(@Param('commentId', CommentByIdPipe) comment: CommentDocument, @ConnectedUser() user: UserDocument) {
    return this.commentService.removeComment(user, comment);
  }
}
