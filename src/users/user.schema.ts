import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({default: "https://res.cloudinary.com/dhl6bbmhb/image/upload/v1679325243/images_am6ss1.jpg"})
  avatarUrl?: string;

  @Prop({ default: 0 })
  followersCount: number;

  @Prop({ default: 10 })
  followingSlots: number;

  @Prop()
  followingsCount: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(paginate)
