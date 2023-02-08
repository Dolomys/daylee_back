import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { ConnectedUser } from 'src/auth/customAuth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';
import { UserDocument } from 'src/users/user.schema';
import { ArticleByIdPipe } from './article.pipe';
import { ArticleDocument } from './article.schema';
import { ArticleService } from './articles.service';
import { CommentService } from './comments/comments.service';
import { CreateCommentaryDto } from './comments/dto/request/create-commentary.dto';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { UpdateArticleDto } from './dto/request/update-article.dto';
import { GetArticleDto } from './dto/response/get-article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(
    private articleService: ArticleService, 
    private readonly commentService: CommentService) {}

  @Get()
  @ApiCreatedResponse({type: [GetArticleDto]})
  findAll() {
    return this.articleService.getArticles();
  }

  @Post()
  @ApiCreatedResponse({description: 'article created', type: GetArticleDto})
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() createArticleDto: CreateArticleDto, @ConnectedUser() user: UserDocument) {
    return this.articleService.createArticle(createArticleDto, user);
  }

  @Get(':articleId')
  @ApiCreatedResponse({type: GetArticleDto})
  @ApiParam({ name: 'article Id', type: String })
  getOne(@Param('articleId', ArticleByIdPipe) article: ArticleDocument) {
    return article;
  }

  @Put(':articleId')
  @ApiCreatedResponse({description: 'article updated',type: GetArticleDto})
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'article Id', type: String })
  update(
    @Param('articleId', ArticleByIdPipe) articleToUpdate: ArticleDocument,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(articleToUpdate, updateArticleDto);
  }

  @Delete(':articleId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  delete(@Param('articleId') articleId: string) {
    this.articleService.deleteArticle(articleId);

    return {
      statusCode: 204,
      message: 'article deleted',
    };
  }

  @Post(':articleId/comment')
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
