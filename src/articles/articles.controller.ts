import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Auth, AuthOwner } from 'src/auth/utils/auth.decorator';
import { ConnectedUser } from 'src/auth/utils/customAuth.decorator';
import { UploadCloudinaryPipe } from 'src/cloudinary/cloudinary.pipe';
import { UserDocument } from 'src/users/user.schema';
import { ArticleDocument } from './article.schema';
import { ArticleService } from './articles.service';
import { CommentService } from './comments/comments.service';
import { CreateCommentaryDto } from './comments/dto/request/create-commentary.dto';
import { GetCommentaryDto } from './comments/dto/response/get-commentary.dto';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { UpdateArticleDto } from './dto/request/update-article.dto';
import { GetArticleDto, GetArticleLightDto } from './dto/response/get-article.dto';
import { ArticleByIdPipe } from './utils/article.pipe';
import { Categories } from './utils/category/category.enum';
import { ValidateCategoryPipe } from './utils/category/category.pipe';
import { fileFilter } from './utils/file.filter';
import { ValidateSearchPipe } from './utils/search.pipe';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService, private readonly commentService: CommentService) {}

  @Get()
  @ApiCreatedResponse({ type: [GetArticleLightDto] })
  findAll(
    @Query('search', ValidateSearchPipe) search: string,
    @Query('category', ValidateCategoryPipe) category: Categories,
  ) {
    return this.articleService.getArticles(category, search);
  }

  @Post()
  @ApiCreatedResponse({ type: GetArticleDto })
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createArticleDto: CreateArticleDto,
    @ConnectedUser() user: UserDocument,
    @UploadedFile(UploadCloudinaryPipe) fileUrl?: string,
  ) {
    return this.articleService.createArticle({ ...createArticleDto, photoUrl: fileUrl }, user);
  }

  @Get(':articleId')
  @ApiCreatedResponse({ type: GetArticleDto })
  @ApiParam({ name: 'articleId', type: String })
  getOne(@Param('articleId', ArticleByIdPipe) article: ArticleDocument) {
    return this.articleService.getArticleWithComments(article);
  }

  @Put(':articleId')
  @ApiCreatedResponse({ type: GetArticleDto })
  @AuthOwner()
  @ApiParam({ name: 'articleId', type: String })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  update(
    @Param('articleId', ArticleByIdPipe) articleToUpdate: ArticleDocument,
    @Body() updateArticleDto: UpdateArticleDto,
    @UploadedFile(UploadCloudinaryPipe) fileUrl?: string,
  ) {
    return this.articleService.updateArticle(articleToUpdate, { ...updateArticleDto, photoUrl: fileUrl });
  }

  @Delete(':articleId')
  @AuthOwner()
  delete(@Param('articleId') articleId: string) {
    this.articleService.deleteArticle(articleId);
    return {
      statusCode: 204,
      message: 'article deleted',
    };
  }

  @Post(':articleId/comment')
  @ApiCreatedResponse({ type: GetCommentaryDto })
  @Auth()
  async addComment(
    @Param('articleId', ArticleByIdPipe) article: ArticleDocument,
    @Body() createCommentaryDto: CreateCommentaryDto,
    @ConnectedUser() user: UserDocument,
  ) {
    return this.commentService.addComment(user, createCommentaryDto, article);
  }
}
