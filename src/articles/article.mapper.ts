import { Injectable } from '@nestjs/common';
import { UserMapper } from 'src/users/user.mapper';
import { ArticleDocument } from './article.schema';
import { CommentService } from './comments/comments.service';
import { GetArticleLightDto } from './dto/response/get-article-light.dto';
import { GetArticleDto } from './dto/response/get-article.dto';

@Injectable()
export class ArticleMapper {
  constructor(private readonly userMapper: UserMapper, private readonly commentService: CommentService) {}

  async toGetArticleDto(article: ArticleDocument): Promise<GetArticleDto> {
    return {
      id: article._id,
      content: article.description,
      photoUrl: article.photoUrl,
      owner: this.userMapper.toGetUserLightDto(article.owner),
      comments: await this.commentService.getArticleComments(article),
    };
  }

  async toGetArticleLightDto(article: ArticleDocument): Promise<GetArticleLightDto> {
    const comments = await this.commentService.getArticleComments(article);
    return {
      id: article._id,
      owner: this.userMapper.toGetUserLightDto(article.owner),
      commentCount: comments.length,
      likeCount: article.likes?.length,
    };
  }
}
