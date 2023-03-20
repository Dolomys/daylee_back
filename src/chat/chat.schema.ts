import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';

export type ChatDocument = HydratedDocument<Chat>;
export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({
  timestamps: true,
})
export class Chat {
  @Prop()
  roomId: string;

  @Prop()
  message: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  sender: UserDocument;
}

@Schema({
  timestamps: true,
})
export class ChatRoom {
  @Prop({ type: Boolean })
  IsPrivate: boolean;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', required: true })
  participants: UserDocument[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
