import { Injectable } from '@nestjs/common';
import { Article } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleRepository } from './article.repository';
import { NewCommentary } from './dto/new-commentary.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async getArticleById(articleId: string): Promise<Article> {
    return this.articleRepository.findOne({ _id: articleId });
  }

  async getArticles(): Promise<Article[]> {
    return this.articleRepository.findAll();
  }

  async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articleRepository.create(createArticleDto);
  }

  async updateArticle(articleId: string, updateArticleDto: UpdateArticleDto) {
    return this.articleRepository.update({ _id: articleId }, updateArticleDto);
  }

  async deleteArticle(articleId: string) {
    return this.articleRepository.delete({ _id: articleId });
  }

  async addComment(articleId: string, newComment: NewCommentary) {
    return this.articleRepository.addComment({ _id: articleId }, newComment);
  }
}
