import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { UserDocument } from 'src/users/user.schema';
import { ArticleDocument } from '../article.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment extends Document {
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

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  })
  parentComment?: CommentDocument;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.plugin(paginate);
