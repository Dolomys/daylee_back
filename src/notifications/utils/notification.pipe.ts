import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { NotificationsRepository } from '../notifications.repository';

@Injectable()
export class NotificationByIdPipe implements PipeTransform {
  constructor(private readonly notificationRepository: NotificationsRepository) {}

  transform(value: any, metadata: ArgumentMetadata) {
    return this.notificationRepository.findOneById(value);
  }
}
