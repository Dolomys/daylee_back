import { Body, Controller, Delete, Get, Param, ParseFilePipe, Post, UseInterceptors } from '@nestjs/common';
import { Query, UploadedFiles } from '@nestjs/common/decorators/http/route-params.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserDocument } from 'src/users/user.schema';
import { Protect, ProtectOwner } from 'src/utils/decorator/auth.decorator';
import { ConnectedUser } from 'src/utils/decorator/customAuth.decorator';
import { ApiPaginatedDto } from 'src/utils/tools/dto/api-pagined-dto.decorator';
import { PaginationOptionsDto } from 'src/utils/tools/dto/request/pagination-options.dto';
import { CustomFilesTypeValidator } from 'src/utils/validator/file.validator';
import { ArticleDocument } from './article.schema';
import { ArticleService } from './articles.service';
import { CommentService } from './comments/comments.service';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { GetArticleLightDto } from './dto/response/get-article-light.dto';
import { GetArticleDto } from './dto/response/get-article.dto';
import { ArticleByIdPipe } from './utils/article.pipe';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService, private readonly commentService: CommentService) {}

  @Protect()
  @Get()
  @ApiOperation({ summary: 'Get All Articles Paginated' })
  @ApiPaginatedDto(GetArticleLightDto)
  findAllPaginated(@ConnectedUser() user: UserDocument, @Query() paginationOptionsDto: PaginationOptionsDto) {
    return this.articleService.getArticles(paginationOptionsDto, user);
  }

  @Protect()
  @Get('feed')
  @ApiOperation({ summary: 'Get Followings Feed Articles Paginated' })
  @ApiPaginatedDto(GetArticleLightDto)
  getFeedPaginated(@ConnectedUser() user: UserDocument, @Query() paginationOptionsDto: PaginationOptionsDto) {
    return this.articleService.getFeed(user, paginationOptionsDto);
  }

  @Protect()
  @Get('personal')
  @ApiOperation({ summary: 'Get Connected User Feed Articles Paginated' })
  @ApiPaginatedDto(GetArticleLightDto)
  getPersonalFeedPaginated(@ConnectedUser() user: UserDocument, @Query() paginationOptionsDto: PaginationOptionsDto) {
    return this.articleService.getPersonalFeed(user, paginationOptionsDto);
  }

  @Protect()
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create Article' })
  @ApiOkResponse({ description: 'SUCCESS', type: GetArticleDto })
  create(
    @ConnectedUser() user: UserDocument,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new CustomFilesTypeValidator({})],
      }),
    )
    images: Express.Multer.File[],
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return this.articleService.createArticle(images, createArticleDto.description, user);
  }

  @Get(':articleId')
  @ApiParam({ name: 'articleId', type: String })
  @ApiOperation({ summary: 'Get Article by ID' })
  @ApiOkResponse({ description: 'SUCCESS', type: GetArticleDto })
  getOne(@Param('articleId', ArticleByIdPipe) article: ArticleDocument) {
    return this.articleService.getArticleFull(article);
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
}
