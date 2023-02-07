import { Injectable } from '@nestjs/common';
import { GetArticleDto } from './dto/response/get-article.dto';

@Injectable()
export class ArticleMapper {
    constructor(){}

  toGetArticleDto = (article: any): GetArticleDto => ({
    id: article._id,
    title: article.title,
    content: article.content,
    photoUrl: article.photoUrl,
    owner: article.ownerId
  });
}
