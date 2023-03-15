import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { SocketWithAuth } from 'utils/types';
import { ChatRepository } from './chat.repository';
import { CreateRoomDto } from './utils/dto/request/create-room.dto';
import { JoinRoomDto } from './utils/dto/request/join-room-dto';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository, private readonly usersRepository: UsersRepository) {}

  async joinRoom(client: SocketWithAuth, joinRoomDto: JoinRoomDto) {
    const isInRoom = await this.chatRepository.isInRoom(joinRoomDto.roomId, client.id);
    if (!isInRoom) throw new UnauthorizedException('NOT_IN_ROOM');
    client.join(joinRoomDto.roomId);
    client.to(joinRoomDto.roomId).emit(`${client.username} has joined room ${joinRoomDto.roomId}`);
  }

  async createRoom(client: SocketWithAuth, createRoomDto: CreateRoomDto) {
    const participants = await this.usersRepository.findManyById(createRoomDto.participantsId);
    const newRoom = await this.chatRepository.saveRoom({
      IsPrivate: createRoomDto.isPrivate,
      participants: participants,
    });
    client.to(client.id).emit(`${client.username} created room ${newRoom._id.toString()}`);
  }

//   async createMessage(client: SocketWithAuth, newMessageDto: NewMessageDto) => 

  getUsersRooms = (client: SocketWithAuth) => this.chatRepository.getRoomsByUser(client.id)
}
