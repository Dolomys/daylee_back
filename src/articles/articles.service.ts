import { Injectable, NotFoundException } from '@nestjs/common';
import { Article } from './schemas/article.schema';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { UpdateArticleDto } from './dto/request/update-article.dto';
import { ArticleRepository } from './article.repository';
import { NewCommentary } from './dto/request/create-commentary.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async getArticleById(articleId: string): Promise<Article> {
    const result = this.articleRepository.findOne({ _id: articleId });
    if (result) return result;
    else throw new NotFoundException(`this article doesn't exist`);
  }

  async getArticles(): Promise<Article[]> {
    return this.articleRepository.findAll();
  }

  async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articleRepository.create(createArticleDto);
  }

  async updateArticle(
    articleToUpdate: Article,
    updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleRepository.update(articleToUpdate, updateArticleDto);
  }

  async deleteArticle(articleId: string) {
    return this.articleRepository.delete({ _id: articleId });
  }

  async addComment(articleId: string, newComment: NewCommentary) {
    return this.articleRepository.addComment({ _id: articleId }, newComment);
  }
}
