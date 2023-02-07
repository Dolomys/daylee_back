import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';
import { ArticleByIdPipe } from './article.pipe';
import { Article } from './article.schema';
import { ArticleService } from './articles.service';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { UpdateArticleDto } from './dto/request/update-article.dto';
import { GetArticleDto } from './dto/response/get-article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @ApiCreatedResponse({
    type: [GetArticleDto],
  })
  @Get()
  findAll() {
    return this.articleService.getArticles();
  }

  @ApiCreatedResponse({
    description: 'article created',
    type: GetArticleDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req
    ) {
    return this.articleService.createArticle(createArticleDto,req.user.userId);
  }

  @ApiCreatedResponse({
    type: GetArticleDto,
  })
  @ApiParam({name:'article Id', type: String})
  @Get(':articleId')
  getOne(@Param('articleId', ArticleByIdPipe) article: Article) {
    return article;
  }


  @ApiCreatedResponse({
    description: 'article updated',
    type: GetArticleDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({name:'article Id', type: String})
  @Put(':articleId')
  update(
    @Param('articleId', ArticleByIdPipe) articleToUpdate: Article,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(articleToUpdate, updateArticleDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':articleId')
  delete(@Param('articleId') articleId: string) {
    
    this.articleService.deleteArticle(articleId)

    return {
      statusCode: 204,
      message: 'article deleted'
    }

  }
}
