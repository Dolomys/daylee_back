import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { LastTimeUserLeftInterface } from './utils/last-time-user-left.interface';

export type ChatDocument = HydratedDocument<Chat>;
export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({
  timestamps: true,
})
export class Chat {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true })
  roomId: Types.ObjectId;

  @Prop()
  message: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  sender: UserDocument;

  @Prop({ type: Date })
  createdAt?: Date;
}

@Schema({
  timestamps: true,
})
export class ChatRoom {
  @Prop({ type: Boolean })
  IsPrivate: boolean;

  //TODO Rajouter limite 10 ?
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', required: true })
  participants: UserDocument[];

  @Prop({ type: Array })
  participantsLastSeen?: LastTimeUserLeftInterface[];

  @Prop({ type: Date })
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
