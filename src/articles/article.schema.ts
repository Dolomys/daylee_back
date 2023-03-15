import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {
  @Prop({ required: true })
  description: string;

  @Prop()
  photoUrl: string;

  @Prop()
  likes?: Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: UserDocument;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
ArticleSchema.index;
