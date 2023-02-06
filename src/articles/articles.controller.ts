import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';
import { ArticleByIdPipe } from './article.pipe';
import { ArticleService } from './articles.service';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { NewCommentary } from './dto/request/create-commentary.dto';
import { UpdateArticleDto } from './dto/request/update-article.dto';
import { GetArticleDto } from './dto/response/GetArticle';
import { Article } from './schemas/article.schema';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @ApiCreatedResponse({
    type: [GetArticleDto],
  })
  @Get()
  async findAll() {
    return this.articleService.getArticles();
  }

  @ApiCreatedResponse({
    description: 'article created',
    type: GetArticleDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.createArticle(createArticleDto);
  }

  @ApiCreatedResponse({
    type: GetArticleDto,
  })
  @Get(':id')
  async getOne(@Param('id', ArticleByIdPipe) article: Article) {
    return article;
  }

  @ApiCreatedResponse({
    description: 'article updated',
    type: GetArticleDto,
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ArticleByIdPipe) articleToUpdate: Article,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(articleToUpdate, updateArticleDto);
  }

  @Delete(':id')
  async delete(@Param('id') articleId: string) {
    return this.articleService.deleteArticle(articleId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/comment/:id')
  async addComment(
    @Param('id') articleId: string,
    @Body() newCommentary: NewCommentary,
  ) {
    return this.articleService.addComment(articleId, newCommentary);
  }
}
