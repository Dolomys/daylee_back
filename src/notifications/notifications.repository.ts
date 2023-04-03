import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';
import { createNotificationInterface } from './utils/create-notification.interface';

@Injectable()
export class NotificationsRepository {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {}

  async orThrow<T>(x: T | null) {
    if (x == null) throw new NotFoundException('Notification not found');
    return x;
  }

  create = (createNotificationInterface: createNotificationInterface) => this.notificationModel.create(createNotificationInterface);

  findOneById = (notificationId: string) => this.notificationModel.findById(notificationId).exec().then(this.orThrow);

  findAllByReceiverId = (userId: Types.ObjectId) =>
    this.notificationModel.find({ receiver: userId }).exec().then(this.orThrow);

  findAllNotSeenByReceiverId = (userId: Types.ObjectId) =>
    this.notificationModel.find({ receiver: userId, hasSeen: false }).exec().then(this.orThrow);

  updateSeenOne = (notification: NotificationDocument) => {
    notification.hasSeen = true;
    return notification.save();
  };

  delete = (notificationId: string) =>
    this.notificationModel.deleteOne({ _id: notificationId }).exec().then(this.orThrow);
}
