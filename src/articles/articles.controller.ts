import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiConsumes, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data/dist/decorators';
import { UserDocument } from 'src/users/user.schema';
import { Protect, ProtectOwner } from 'src/utils/decorator/auth.decorator';
import { ConnectedUser } from 'src/utils/decorator/customAuth.decorator';
import { ArticleDocument } from './article.schema';
import { ArticleService } from './articles.service';
import { CommentByIdPipe } from './comments/comment.pipe';
import { CommentDocument } from './comments/comment.schema';
import { CommentService } from './comments/comments.service';
import { CreateCommentaryDto } from './comments/dto/request/create-commentary.dto';
import { GetCommentaryDto } from './comments/dto/response/get-commentary.dto';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { UpdateArticleDto } from './dto/request/update-article.dto';
import { GetArticleLightDto } from './dto/response/get-article-light.dto';
import { GetArticleDto } from './dto/response/get-article.dto';
import { ArticleByIdPipe } from './utils/article.pipe';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService, private readonly commentService: CommentService) {}

  //TODO add pagination
  @Protect()
  @Get()
  @ApiOperation({ summary: 'Get All Articles Paginated' })
  @ApiOkResponse({ description: 'SUCCESS', type: [GetArticleLightDto] })
  findAllPaginated() {
    return this.articleService.getArticles();
  }

  @Protect()
  @Post()
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Add Article' })
  @ApiOkResponse({ description: 'SUCCESS', type: GetArticleDto })
  create(@ConnectedUser() user: UserDocument, @Body() createArticleDto: CreateArticleDto) {
    return this.articleService.createArticle(createArticleDto, user);
  }

  @Get(':articleId')
  @ApiParam({ name: 'articleId', type: String })
  @ApiOperation({ summary: 'Get Article by ID' })
  @ApiOkResponse({ description: 'SUCCESS', type: GetArticleDto })
  getOne(@Param('articleId', ArticleByIdPipe) article: ArticleDocument) {
    return this.articleService.getArticleWithComments(article);
  }

  @ProtectOwner()
  @Patch(':articleId')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'articleId', type: String })
  @ApiOperation({ summary: 'Update Article by ID' })
  @ApiOkResponse({ description: 'SUCCESS', type: GetArticleDto })
  update(
    @Param('articleId', ArticleByIdPipe) articleToUpdate: ArticleDocument,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(articleToUpdate, updateArticleDto);
  }

  @ProtectOwner()
  @Delete(':articleId')
  @ApiOperation({ summary: 'Delete Article by ID' })
  @ApiNoContentResponse({ description: 'SUCCESS' })
  delete(@Param('articleId') articleId: string) {
    this.articleService.deleteArticle(articleId);
    return {
      statusCode: 204,
      message: 'article deleted',
    };
  }

  @Protect()
  @Post(':articleId/like')
  @ApiOperation({ summary: 'Add like to post' })
  @ApiParam({ name: 'articleId', type: String })
  @ApiOkResponse({ description: 'SUCCESS', type: GetArticleLightDto })
  addLikeToArticle(@Param('articleId', ArticleByIdPipe) article: ArticleDocument, @ConnectedUser() user: UserDocument) {
    return this.articleService.addLikeToArticle(article, user);
  }

  @Protect()
  @Post(':articleId/comment')
  @ApiParam({ name: 'articleId', type: String })
  @ApiOperation({ summary: 'Add comment to post' })
  @ApiOkResponse({ type: GetCommentaryDto })
  addComment(
    @Param('articleId', ArticleByIdPipe) article: ArticleDocument,
    @Body() createCommentaryDto: CreateCommentaryDto,
    @ConnectedUser() user: UserDocument,
    @Body('commentParentId', CommentByIdPipe) parentComment?: CommentDocument,
  ) {
    return this.commentService.addComment(user, createCommentaryDto, article, parentComment);
  }
}
