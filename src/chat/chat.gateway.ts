import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { Namespace } from 'socket.io';
import { SocketWithAuth } from 'src/utils/types';
import { WsCatchAllFilter } from '../utils/sockets/exceptions/ws-catch-all-filters';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './utils/dto/request/create-room.dto';
import { JoinRoomDto } from './utils/dto/request/join-room-dto';
import { NewMessageDto } from './utils/dto/request/new-message.dto';

@UsePipes(new ValidationPipe())
@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements NestGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  io: Namespace;

  afterInit(server: any) {}

  handleConnection(client: SocketWithAuth, ...args: any[]) {
    client.on('disconnecting', (reason) => {
      const room = Array.from(client.rooms);
      this.chatService.addOrUpdateLastLeaveTime(room[1], client);
    });
  }

  handleDisconnect(client: SocketWithAuth) {}

  @SubscribeMessage('create')
  async handleCreateRoom(@ConnectedSocket() client: SocketWithAuth, @MessageBody() createRoomDto: CreateRoomDto) {
    this.chatService.createRoom(client, createRoomDto);
  }

  @SubscribeMessage('join')
  handleJoinRoom(@ConnectedSocket() client: SocketWithAuth, @MessageBody() joinRoomDto: JoinRoomDto) {
    this.chatService.joinRoom(client, joinRoomDto, this.io);
  }

  @SubscribeMessage('chat')
  async handleNewMessage(client: SocketWithAuth, newMessageDto: NewMessageDto) {
    await this.chatService.createMessage(client, newMessageDto);
    const rooms = Array.from(client.rooms);
    client.broadcast.to(rooms[1]).emit('mesage', newMessageDto.message);
  }
}
