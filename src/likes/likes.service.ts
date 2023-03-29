import { Injectable } from '@nestjs/common';
import { ArticleMapper } from 'src/articles/article.mapper';
import { ArticleDocument } from 'src/articles/article.schema';
import { ArticleRepository } from 'src/articles/articles.repository';
import { UserMapper } from 'src/users/user.mapper';
import { UserDocument } from 'src/users/user.schema';
import { GetUserDtoLight } from 'src/users/utils/dto/response/get-user-light.dto';
import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepository: LikesRepository,
    private readonly userMapper: UserMapper,
    private readonly articleMapper: ArticleMapper,
    private readonly articleRepository: ArticleRepository,
  ) {}

  async getArticleLikesUsersList(article: ArticleDocument): Promise<GetUserDtoLight[]> {
    const likes = await this.likesRepository.findArticleLikes(article);
    const likeOwner = likes.map(({ owner, ...removeAttr }) => owner);
    return this.userMapper.toGetUsersLightListDto(likeOwner);
  }

  async toggleLike(article: ArticleDocument, user: UserDocument) {
    const articleLike = await this.likesRepository.findArticleLike(article, user);
    let newArticle: ArticleDocument;
    if (!articleLike) {
      await this.likesRepository.create({ entity: article, owner: user });
      newArticle = await this.articleRepository.updateLikesCount(article, 1);
    } else {
      await this.likesRepository.delete(articleLike);
      newArticle = await this.articleRepository.updateLikesCount(article, -1);
    }
    return this.articleMapper.toGetArticleLightDto(newArticle);
  }
}
