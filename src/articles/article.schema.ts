import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { GetCommentaryDto } from './comments/dto/response/get-commentary.dto';
import { Categories } from './utils/category.enum';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {
  @Prop({ required: true, index: "text" })
  title: string;

  @Prop({ required: true, index: "text" })
  content: string;

  @Prop()
  photoUrl?: string;

  @Prop({index: "text"})
  category: Categories

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: "text" })
  owner: UserDocument;

  @Prop()
  comments?: GetCommentaryDto[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
ArticleSchema.index
