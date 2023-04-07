import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';

export type StoryDocument = HydratedDocument<Story>;

@Schema({
  timestamps: true,
})
export class Story {
  @Prop({ required: true })
  fileUrl: string;

  @Prop({ required: true })
  fileId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: UserDocument;

  @Prop({ type: Date })
  createdAt: Date;
}

export const StorySchema = SchemaFactory.createForClass(Story);
