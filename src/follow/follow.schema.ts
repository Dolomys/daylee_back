import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';


export type FollowDocument = HydratedDocument<Follow>;

@Schema()
export class Follow {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  follower: UserDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  following: UserDocument;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
