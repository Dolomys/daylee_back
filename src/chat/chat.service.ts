import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import mongoose from 'mongoose';
import { Namespace } from 'socket.io';
import { UserDocument } from 'src/users/user.schema';
import { UsersRepository } from 'src/users/users.repository';
import { SocketWithAuth } from 'src/utils/types';
import { ChatMapper } from './chat.mapper';
import { ChatRepository } from './chat.repository';
import { Chat } from './chat.schema';
import { CreateRoomDto } from './utils/dto/request/create-room.dto';
import { JoinRoomDto } from './utils/dto/request/join-room-dto';
import { NewMessageDto } from './utils/dto/request/new-message.dto';
import { GetRoomDto } from './utils/dto/response/get-rooms.dto';
import { LastTimeUserLeftInterface } from './utils/last-time-user-left.interface';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly usersRepository: UsersRepository,
    private readonly chatMapper: ChatMapper,
  ) {}

  async joinRoom(client: SocketWithAuth, joinRoomDto: JoinRoomDto, io: Namespace) {
    const isInRoom = await this.chatRepository.isInRoom(joinRoomDto.roomId, client.id);
    if (!isInRoom) throw new UnauthorizedException('NOT_IN_ROOM');
    client.join(joinRoomDto.roomId);
    io.to(joinRoomDto.roomId).emit('message', `${client.username} has joined room ${joinRoomDto.roomId}`);
  }

  async createRoom(client: SocketWithAuth, createRoomDto: CreateRoomDto) {
    const participants = await this.usersRepository.findManyById(createRoomDto.participantsId);
    const doesChatExist = await this.chatRepository.chatRoomContainsAllUsers(participants);
    if (doesChatExist) throw new BadRequestException('THIS ROOM ALREADY EXIST');
    const newRoom = await this.chatRepository.saveRoom({
      IsPrivate: createRoomDto.isPrivate,
      participants: participants,
    });
    client.join(newRoom._id.toString());
    client.emit('message', `${client.username} created room ${newRoom._id.toString()}`);
  }

  async createMessage(client: SocketWithAuth, newMessageDto: NewMessageDto) {
    const chat: Chat = {
      roomId: new mongoose.Types.ObjectId(newMessageDto.roomId),
      message: newMessageDto.message,
      sender: await this.usersRepository.findOneById(client.id),
    };
    this.chatRepository.saveChat(chat);
  }

  async getUsersRooms(user: UserDocument): Promise<GetRoomDto[]> {
    const rooms = await this.chatRepository.getRoomsByUser(user.id);
    return this.chatMapper.toGetRoomsDto(rooms, user);
  }

  async getRoomMessages(roomId: string, user: UserDocument) {
    const isInRoom = await this.chatRepository.isInRoom(roomId, user.id);
    if (!isInRoom) throw new UnauthorizedException('NOT_IN_ROOM');
    return this.chatRepository.getRoomMessages(roomId).then((data) => this.chatMapper.toGetRoomMessagesDto(data));
  }

  async addOrUpdateLastLeaveTime(roomId: string, client: SocketWithAuth) {
    const hasAlreadyLeftTime = await this.chatRepository.isParticipantFirstTimeLeaveRoom(roomId, client.id);
    const lastTimeUserLeft: LastTimeUserLeftInterface = { userId: client.id, lastDisconnect: new Date(Date.now()) };
    if (!hasAlreadyLeftTime) await this.chatRepository.addRoomTimeLeft(roomId, lastTimeUserLeft);
    else await this.chatRepository.updateRoomTimeLeft(roomId, lastTimeUserLeft);
  }
}
