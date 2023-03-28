import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';

export type StoryDocument = HydratedDocument<Story>;

@Schema({
  timestamps: true,
})
export class Story extends Document {
  @Prop({ required: true })
  filesUrls: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: UserDocument;
}

export const StorySchema = SchemaFactory.createForClass(Story);
