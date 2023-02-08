import { forwardRef, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { UserDocument } from 'src/users/user.schema';
import { ArticleMapper } from './article.mapper';
import { Article, ArticleDocument } from './article.schema';
import { ArticleRepository } from './articles.repository';
import { CommentMapper } from './comments/comment.mapper';
import { CommentRepository } from './comments/comments.repository';
import { GetCommentaryDto } from './comments/dto/response/get-commentary.dto';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { UpdateArticleDto } from './dto/request/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleMapper: ArticleMapper,
    @Inject(forwardRef(() => CommentRepository))
    private commentRepository: CommentRepository,
    @Inject(forwardRef(() => CommentMapper))
    private commentMapper: CommentMapper,
  ) {}

  getArticleComments(article: Article): Promise<GetCommentaryDto[]> {
    return this.commentRepository
      .findComments({ article: article })
      .then((commentList) =>
        commentList.map((comment) =>
          this.commentMapper.toGetCommentDto(comment),
        ),
      );
  }

   getArticleById(articleId: string): Promise<ArticleDocument> {
    return this.articleRepository.findOneById(articleId);
  }

  getArticles() {
    return this.articleRepository
      .findAll()
      .then((articleList) =>
        articleList.map((article) =>
          this.articleMapper.toGetArticleLightDto(article),
        ),
      );
  }

  async createArticle(
    createArticleDto: CreateArticleDto,
    user: UserDocument,
  ) {
    const newArticle: Article = {
      ...createArticleDto,
      owner: user,
    };
    const articleCreated = await this.articleRepository.create(newArticle);
    return this.articleMapper.toGetArticleDto(articleCreated);
  }

  async updateArticle(
    articleToUpdate: ArticleDocument,
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
