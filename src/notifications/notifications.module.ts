import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from 'src/articles/articles.module';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationsController } from './notifications.controller';
import { NotificationsMapper } from './notifications.mapper';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsService } from './notifications.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(() => ArticleModule),
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsRepository, NotificationsMapper],
  exports: [NotificationsService, NotificationsRepository, NotificationsMapper],
})
export class NotificationsModule {}
