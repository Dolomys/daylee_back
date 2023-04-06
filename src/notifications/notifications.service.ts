import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/users/user.schema';
import { NotificationDocument } from './notification.schema';
import { NotificationsMapper } from './notifications.mapper';
import { NotificationsRepository } from './notifications.repository';
import { createNotificationInterface } from './utils/create-notification.interface';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationsMapper: NotificationsMapper,
  ) {}

  getAllNotificationByUser = async (user: UserDocument) => {
    const notifications = await this.notificationsRepository.findAllByReceiverId(user.id);
    return this.notificationsMapper.toGetNotificationsDto(notifications);
  };

  getNotSeenNotificationByUser = async (user: UserDocument) => {
    const notifications = await this.notificationsRepository.findAllNotSeenByReceiverId(user.id);
    return this.notificationsMapper.toGetNotificationsDto(notifications);
  };

  updateNotificationSeen = async (notification: NotificationDocument, user: UserDocument) => {
    const updatedNotification = await this.notificationsRepository.updateSeenOne(notification);
    return this.notificationsMapper.toGetNotificationDto(updatedNotification);
  };

  createNotification = async (createNotificationInterface: createNotificationInterface) => {
    const notification = await this.notificationsRepository.create(createNotificationInterface);
  };
}
