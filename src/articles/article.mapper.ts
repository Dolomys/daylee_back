import { Injectable } from '@nestjs/common';
import { UserMapper } from 'src/users/user.mapper';
import { ArticleDocument } from './article.schema';
import { CommentRepository } from './comments/comments.repository';
import { CommentService } from './comments/comments.service';
import { GetArticleLightDto } from './dto/response/get-article-light.dto';
import { GetArticleDto } from './dto/response/get-article.dto';

@Injectable()
export class ArticleMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly commentService: CommentService,
    private readonly commentRepository: CommentRepository,
  ) {}

  async toGetArticleDto(article: ArticleDocument): Promise<GetArticleDto> {
    return {
      id: article._id,
      content: article.description,
      photoUrl: article.photoUrl,
      owner: this.userMapper.toGetUserLightDto(article.owner),
      comments: await this.commentService.getArticleComments(article),
    };
  }

  toGetArticleListLightDto = (articles: ArticleDocument[]): Promise<GetArticleLightDto[]> =>
    Promise.all(articles.map((x) => this.toGetArticleLightDto(x)));

  async toGetArticleLightDto(article: ArticleDocument): Promise<GetArticleLightDto> {
    const commentCount = await this.commentRepository.countCommentsByArticle(article);
    return {
      id: article.id,
      commentCount: commentCount,
      likeCount: article.likes?.length ?? 0,
      content: article.description,
      photoUrl: article.photoUrl,
      owner: article.owner && this.userMapper.toGetUserLightDto(article.owner),
    };
  }
}
