import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Article } from '../article.schema';


export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  ownerId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true })
  article: Article
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
