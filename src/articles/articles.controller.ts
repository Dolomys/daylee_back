import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, UploadedFile, UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { ConnectedUser } from 'src/auth/customAuth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';
import { UploadCloudinaryPipe } from 'src/cloudinary/cloudinary.pipe';
import { UserDocument } from 'src/users/user.schema';
import { ArticleByIdPipe } from './article.pipe';
import { ArticleDocument } from './article.schema';
import { ArticleService } from './articles.service';
import { CommentService } from './comments/comments.service';
import { CreateCommentaryDto } from './comments/dto/request/create-commentary.dto';
import { GetCommentaryDto } from './comments/dto/response/get-commentary.dto';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { UpdateArticleDto } from './dto/request/update-article.dto';
import { GetArticleDto, GetArticleLightDto } from './dto/response/get-article.dto';
import { ArticleOwnerGuard } from './utils/isOwner.guard';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(
    private articleService: ArticleService, 
    private readonly commentService: CommentService) {}

  @Get()
  @ApiCreatedResponse({type: [GetArticleLightDto]})
  findAll() {
    return this.articleService.getArticles();
  }

  @Post()
  @ApiCreatedResponse({type: GetArticleDto})
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createArticleDto: CreateArticleDto,
    @ConnectedUser() user: UserDocument,
    @UploadedFile(UploadCloudinaryPipe) fileUrl?: string) {
    return this.articleService.createArticle(
      {...createArticleDto, photoUrl:fileUrl},
      user
    );
  }

  @Get(':articleId')
  @ApiCreatedResponse({type: GetArticleDto})
  @ApiParam({ name: 'articleId', type: String })
  getOne(@Param('articleId', ArticleByIdPipe) article: ArticleDocument) {
    return this.articleService.getArticleWithComments(article)
  }

  @Put(':articleId')
  @ApiCreatedResponse({type: GetArticleDto})
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, ArticleOwnerGuard)
  @ApiParam({ name: 'articleId', type: String })
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('articleId', ArticleByIdPipe) articleToUpdate: ArticleDocument,
    @Body() updateArticleDto: UpdateArticleDto,
    @UploadedFile(UploadCloudinaryPipe) fileUrl?: string
  ) {
    return this.articleService.updateArticle(
      articleToUpdate,
       {...updateArticleDto, photoUrl:fileUrl}
       );
  }

  @Delete(':articleId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, ArticleOwnerGuard)
  delete(@Param('articleId') articleId: string) {
    this.articleService.deleteArticle(articleId);

    return {
      statusCode: 204,
      message: 'article deleted',
    };
  }

  @Post(':articleId/comment')
  @ApiCreatedResponse({type: GetCommentaryDto})
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('articleId', ArticleByIdPipe) article: ArticleDocument,
    @Body() createCommentaryDto: CreateCommentaryDto,
    @ConnectedUser() user: UserDocument,
  ) {
    return this.commentService.addComment(
      user,
      createCommentaryDto,
      article,
    );
  }
}
