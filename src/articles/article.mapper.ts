import { Injectable } from '@nestjs/common';
import { UserMapper } from 'src/users/user.mapper';
import { ArticleDocument } from './article.schema';
import { GetCommentaryDto } from './comments/dto/response/get-commentary.dto';
import { GetArticleLightDto } from './dto/response/get-article-light.dto';
import { GetArticleDto } from './dto/response/get-article.dto';

@Injectable()
export class ArticleMapper {
  constructor(private readonly userMapper: UserMapper) {}

  toGetArticleDto = (article: ArticleDocument, comments: GetCommentaryDto[] | null = null): GetArticleDto => ({
    id: article._id,
    content: article.description,
    photoUrl: article.photoUrl,
    owner: this.userMapper.toGetUserLightDto(article.owner),
    comments: comments,
  });

  toGetArticleLightDto = (article: ArticleDocument): GetArticleLightDto => ({
    id: article._id,
    owner: this.userMapper.toGetUserLightDto(article.owner),
    commentCount: article.comments?.length,
    likeCount: article.likes?.length,
  });
}
