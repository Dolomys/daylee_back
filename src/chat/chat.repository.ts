import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat, ChatDocument, ChatRoom, ChatRoomDocument } from './chat.schema';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(ChatRoom.name) private chatRoom: Model<ChatRoomDocument>,
  ) {}

  async orThrow<T>(x: T | null) {
    if (x == null) throw new NotFoundException('Chat not found');
    return x;
  }

  getChats = () => this.chatModel.find().exec();

  saveChat = (chat: Chat) => this.chatModel.create(chat);

  saveRoom = (roomChat: ChatRoom) => this.chatRoom.create(roomChat);

  getRoomMessages = (roomChatId: string) => this.chatModel.find({ roomId: roomChatId }).exec().then(this.orThrow);

  async isInRoom(roomChatId: string, userId: Types.ObjectId) {
    const inRoom = await this.chatRoom.find({ _id: roomChatId, $in: { participants: userId } }).exec();
    return inRoom ? true : false;
  }

  getRoomsByUser = (userId: Types.ObjectId) =>
    this.chatRoom
      .find({ $in: { participants: userId } })
      .exec()
      .then(this.orThrow);
}
