import { Injectable } from '@nestjs/common';
import { UserMapper } from 'src/users/user.mapper';
import { ArticleDocument } from './article.schema';
import { GetCommentaryDto } from './comments/dto/response/get-commentary.dto';
import { GetArticleDto, GetArticleLightDto } from './dto/response/get-article.dto';

@Injectable()
export class ArticleMapper {
  constructor(private readonly userMapper: UserMapper) {}

  toGetArticleDto = (article: ArticleDocument, comments: GetCommentaryDto[] | null = null): GetArticleDto => ({
    id: article._id,
    title: article.title,
    content: article.content,
    photoUrl: article.photoUrl,
    category: article.category,
    owner: this.userMapper.toGetUserDto(article.owner),
    comments: comments,
  });

  toGetArticleLightDto = (article: ArticleDocument): GetArticleLightDto => ({
    id: article._id,
    title: article.title,
    category: article.category,
    owner: this.userMapper.toGetUserDto(article.owner),
  });
}
