import { Injectable } from '@nestjs/common';
import { ArticleMapper } from 'src/articles/article.mapper';
import { UserMapper } from 'src/users/user.mapper';
import { NotificationDocument } from './notification.schema';
import { GetNotificationDto } from './utils/dto/response/get-notification.dto';

@Injectable()
export class NotificationsMapper {
  constructor(private readonly userMapper: UserMapper, private readonly articleMapper: ArticleMapper) {}

  toGetNotificationsDto = (notifications: NotificationDocument[]): Promise<GetNotificationDto[]> =>
    Promise.all(notifications.map((notification) => this.toGetNotificationDto(notification)));

  toGetNotificationDto = async (notification: NotificationDocument): Promise<GetNotificationDto> => ({
    notificationType: notification.notificationType,
    article: await this.articleMapper.toGetArticleLightDto(notification.article),
    receiver: this.userMapper.toGetUserLightDto(notification.article.owner),
    sender: this.userMapper.toGetUserLightDto(notification.sender),
    hasSeen: notification.hasSeen,
  });
}
