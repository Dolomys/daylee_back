import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { Chat, ChatDocument, ChatRoom, ChatRoomDocument } from './chat.schema';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoomDocument>,
  ) {}

  async orThrow<T>(x: T | null) {
    if (x == null) throw new NotFoundException('Chat not found');
    return x;
  }

  async chatRoomContainsAllUsers(users: UserDocument[]): Promise<boolean> {
    const chatRoom = await this.chatRoomModel.findOne({
      users: {
        $all: users,
      },
    });
    return chatRoom !== null;
  }

  getChats = () => this.chatModel.find().exec();

  saveChat = (chat: Chat) => this.chatModel.create(chat);

  saveRoom = (roomChat: ChatRoom) => this.chatRoomModel.create(roomChat);

  getRoomMessages = (roomChatId: string) =>
    this.chatModel.find({ roomId: roomChatId }).sort({ createdAt: -1 }).exec().then(this.orThrow);

  async isInRoom(roomChatId: string, userId: Types.ObjectId) {
    const inRoom = await this.chatRoomModel.find({ _id: roomChatId, $in: { participants: userId } }).exec();
    return inRoom ? true : false;
  }

  getRoomsByUser = (userId: Types.ObjectId) =>
    this.chatRoomModel
      .find({ $in: { participants: userId } })
      .exec()
      .then(this.orThrow);
}
