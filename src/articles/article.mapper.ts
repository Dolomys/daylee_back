import { Injectable } from '@nestjs/common';
import { GetCommentaryDto } from './comments/dto/response/get-commentary.dto';
import { GetArticleDto } from './dto/response/get-article.dto';

@Injectable()
export class ArticleMapper {
  constructor() {}

  toGetArticleDto = (
    article: any,
    comments: GetCommentaryDto[] = null,
  ): GetArticleDto => ({
    id: article._id,
    title: article.title,
    content: article.content,
    photoUrl: article.photoUrl,
    owner: article.owner,
    comments: comments,
  });
}
