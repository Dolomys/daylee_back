import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ArticleDocument } from 'src/articles/article.schema';
import { UserDocument } from 'src/users/user.schema';

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Article' })
  entity: ArticleDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: UserDocument;
}

export const LikesSchema = SchemaFactory.createForClass(Like);
