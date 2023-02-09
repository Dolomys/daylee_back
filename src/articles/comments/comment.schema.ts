import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { ArticleDocument } from '../article.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {

  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  })
  article: ArticleDocument;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
