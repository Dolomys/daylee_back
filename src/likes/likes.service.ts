import { Injectable } from '@nestjs/common';
import { ArticleMapper } from 'src/articles/article.mapper';
import { ArticleDocument } from 'src/articles/article.schema';
import { ArticleRepository } from 'src/articles/articles.repository';
import { GetArticleLightDto } from 'src/articles/dto/response/get-article-light.dto';
import { NotificationsRepository } from 'src/notifications/notifications.repository';
import { NotificationsService } from 'src/notifications/notifications.service';
import { createNotificationInterface } from 'src/notifications/utils/create-notification.interface';
import { NotificationTypeEnum } from 'src/notifications/utils/notification-type.enum';
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
    private readonly notificationsService: NotificationsService,
    private readonly notificationsRepository: NotificationsRepository,
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

  async toggleLike(article: ArticleDocument, user: UserDocument): Promise<GetArticleLightDto> {
    const articleLike = await this.likesRepository.findArticleLike(article, user);
    const increment = articleLike ? -1 : 1;
    if (!articleLike) {
      await this.likesRepository.create({ entity: article, owner: user });
      await this.createLikeNotification(article, user);
    } else {
      await this.likesRepository.delete(articleLike);
    }
    const newArticle = await this.articleRepository.updateLikesCount(article, increment);
    return this.articleMapper.toGetArticleLightDto(newArticle, !articleLike);
  }

  async createLikeNotification(article: ArticleDocument, user: UserDocument): Promise<void> {
    const notificationExist = this.notificationsRepository.findOneByArticleAndSender(article, user);
    if (!notificationExist) {
      const notification: createNotificationInterface = {
        notificationType: NotificationTypeEnum.LIKE,
        article: article,
        sender: user,
      };
      await this.notificationsService.createNotification(notification);
    }
  }
}
