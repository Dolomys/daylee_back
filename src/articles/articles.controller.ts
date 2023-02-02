import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ArticleService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { UpdateArticleDto } from './dto/update-article.dto';
import { NewCommentary } from './dto/new-commentary.dto';

@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get()
  async findAll() {
    return this.articleService.getArticles();
  }

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    this.articleService.createArticle(createArticleDto);
  }

  @Get(':id')
  async getOne(@Param('id') articleId: string) {
    const result = await this.articleService.getArticleById(articleId);

    // No error thrown by mongoose if id incorrect, could not try catch
    if (result) return result;
    else
      throw new HttpException(
        'No Article with this id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }

  @Put(':id')
  async update(
    @Param('id') articleId: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(articleId, updateArticleDto);
  }

  @Delete(':id')
  async delete(@Param('id') articleId: string) {
    return this.articleService.deleteArticle(articleId);
  }

  @Post('/comment/:id')
  async addComment(
    @Param('id') articleId: string,
    @Body() newCommentary: NewCommentary,
  ) {
    return this.articleService.addComment(articleId, newCommentary);
  }
}
