import { Injectable } from '@nestjs/common';
import { UserMapper } from 'src/users/user.mapper';
import { ArticleDocument } from './article.schema';
import { CommentRepository } from './comments/comments.repository';
import { GetArticleLightDto } from './dto/response/get-article-light.dto';
import { GetArticleDto } from './dto/response/get-article.dto';

@Injectable()
export class ArticleMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly commentRepository: CommentRepository,
  ) {}

  async toGetArticleDto(article: ArticleDocument): Promise<GetArticleDto> {
    return {
      id: article._id,
      content: article.description,
      photoUrls: article.photoUrls,
      owner: this.userMapper.toGetUserLightDto(article.owner),
    };
  }

  toGetArticleListLightDto = (articles: ArticleDocument[]): Promise<GetArticleLightDto[]> =>
    Promise.all(articles.map((x) => this.toGetArticleLightDto(x)));

  async toGetArticleLightDto(article: ArticleDocument): Promise<GetArticleLightDto> {
    const commentCount = await this.commentRepository.countCommentsByArticle(article);
    return {
      id: article.id,
      description: article.description,
      commentCount: commentCount,
      likeCount: article.likes?.length ?? 0,
      photoUrls: article.photoUrls,
      owner: article.owner && this.userMapper.toGetUserLightDto(article.owner),
    };
  }
}
