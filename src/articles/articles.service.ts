import { forwardRef, Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { Types } from 'mongoose';
import { ArticleMapper } from './article.mapper';
import { Article } from './article.schema';
import { ArticleRepository } from './articles.repository';
import { CommentService } from './comments/comments.service';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { UpdateArticleDto } from './dto/request/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleMapper: ArticleMapper,
    @Inject(forwardRef(() => CommentService))
    private commentService: CommentService,
  ) {}

  async getArticleById(articleId: string) {
    const article = await this.articleRepository.findOne({ _id: articleId });
    const comments = await this.commentService.getArticleComments(article);
    if (!article) throw new NotFoundException(`this article doesn't exist`);

    return this.articleMapper.toGetArticleDto(article, comments);
  }

  getArticles() {
    return this.articleRepository
      .findAll()
      .then((articleList) =>
        articleList.map((article) =>
          this.articleMapper.toGetArticleDto(article),
        ),
      );
  }

  async createArticle(
    createArticleDto: CreateArticleDto,
    userId: Types.ObjectId,
  ) {
    const newArticle: Article = {
      ...createArticleDto,
      owner: userId,
    };
    const articleCreated = await this.articleRepository.create(newArticle);
    console.log(articleCreated);
    return this.articleMapper.toGetArticleDto(articleCreated);
  }

  async updateArticle(
    articleToUpdate: Article,
    updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleRepository
      .update(articleToUpdate, updateArticleDto)
      .then((updatedArticle) =>
        this.articleMapper.toGetArticleDto(updatedArticle),
      );
  }

  deleteArticle(articleId: string) {
    return this.articleRepository.delete({ _id: articleId });
  }
}
