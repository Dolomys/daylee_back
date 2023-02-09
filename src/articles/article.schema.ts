import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { GetCommentaryDto } from './comments/dto/response/get-commentary.dto';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  photoUrl?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: UserDocument;

  @Prop()
  comments?: GetCommentaryDto[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
