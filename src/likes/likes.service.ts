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

  async isLikedByUser(article: ArticleDocument, user: UserDocument): Promise<boolean> {
    const isLiked = await this.likesRepository.findArticleLike(article, user);
    return isLiked ? true : false;
  }

  async toggleLike(article: ArticleDocument, user: UserDocument) {
    const articleLike = await this.likesRepository.findArticleLike(article, user);
    const increment = articleLike ? -1 : 1;
    if (!articleLike) {
      await this.likesRepository.create({ entity: article, owner: user });
    } else {
      await this.likesRepository.delete(articleLike);
    }
    const newArticle = await this.articleRepository.updateLikesCount(article, increment);
    return this.articleMapper.toGetArticleLightDto(newArticle, !articleLike);
  }
}
