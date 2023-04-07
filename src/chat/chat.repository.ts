import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { Chat, ChatDocument, ChatRoom, ChatRoomDocument } from './chat.schema';
import { LastTimeUserLeftInterface } from './utils/last-time-user-left.interface';

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

  saveRoom = (roomChat: any) => this.chatRoomModel.create(roomChat);

  getRoomMessages = (roomChatId: string) =>
    this.chatModel.find({ room: roomChatId }).sort({ createdAt: -1 }).populate('sender').exec().then(this.orThrow);

  getLastRoomMessage = (roomChatId: string) =>
    this.chatModel.findOne({ room: roomChatId }).sort({ createdAt: -1 }).populate('sender').exec().then(this.orThrow);

  async isInRoom(roomChatId: string, userId: Types.ObjectId) {
    const inRoom = await this.chatRoomModel.find({ _id: roomChatId, $in: { participants: userId } }).exec();
    return inRoom.length > 0 ? true : false;
  }

  getRoomsByUser = (userId: Types.ObjectId) =>
    this.chatRoomModel
      .find({ $in: { participants: userId } })
      .exec()
      .then(this.orThrow);

  findOneById = async (roomChatId: string) => this.chatRoomModel.findOne({ _id: roomChatId }).exec().then(this.orThrow);

  updateRoomTimeLeft = (roomChatId: string, lastTimeUserLeftInterface: LastTimeUserLeftInterface) =>
    this.chatRoomModel
      .findOneAndUpdate(
        { _id: roomChatId, 'participantsLastSeen.userId': lastTimeUserLeftInterface.userId },
        {
          $set: {
            'participantsLastSeen.$.lastDisconnect': lastTimeUserLeftInterface.lastDisconnect,
          },
        },
        { upsert: true, new: true },
      )
      .exec()
      .then(this.orThrow);

  addRoomTimeLeft = (roomChatId: string, lastTimeUserLeftInterface: LastTimeUserLeftInterface) =>
    this.chatRoomModel
      .findOneAndUpdate(
        { _id: roomChatId },
        {
          $push: {
            participantsLastSeen: lastTimeUserLeftInterface,
          },
        },
        { new: true },
      )
      .exec()
      .then(this.orThrow);
}
