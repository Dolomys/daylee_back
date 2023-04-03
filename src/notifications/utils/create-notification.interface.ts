import { ArticleDocument } from 'src/articles/article.schema';
import { UserDocument } from 'src/users/user.schema';
import { NotificationTypeEnum } from './notification-type.enum';

export class createNotificationInterface {
  notificationType: NotificationTypeEnum;
  article: ArticleDocument;
  sender: UserDocument;
}
