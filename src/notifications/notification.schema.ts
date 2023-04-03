import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { ArticleDocument } from 'src/articles/article.schema';
import { UserDocument } from 'src/users/user.schema';
import { NotificationTypeEnum } from './utils/notification-type.enum';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification extends Document {
  @Prop({ enum: NotificationTypeEnum, required: true })
  notificationType: NotificationTypeEnum;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true})
  article: ArticleDocument
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  sender: UserDocument;

  @Prop({ default: false, required: true })
  hasSeen: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

