import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { UserDocument } from 'src/users/user.schema';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article extends Document {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  photoUrls: string[];

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: 0 })
  commentCount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: UserDocument;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
ArticleSchema.plugin(paginate);

ArticleSchema.index;
