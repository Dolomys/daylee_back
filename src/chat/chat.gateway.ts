import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import { Namespace } from 'socket.io';
import { ErrorDto } from 'src/utils/sockets/exceptions/ws-exceptions';
import { SocketWithAuth } from 'src/utils/types';
import { WsCatchAllFilter } from '../utils/sockets/exceptions/ws-catch-all-filters';
import { ChatService } from './chat.service';
import { EventPatternChat } from './utils/const';
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

  @AsyncApiSub({
    channel: EventPatternChat.listenExceptions,
    description: 'Listen to error messages',
    message: {
      payload: ErrorDto,
    },
  })
  handleConnection(client: SocketWithAuth, ...args: any[]) {
    client.on('disconnecting', (reason) => {
      const room = Array.from(client.rooms);
      this.chatService.addOrUpdateLastLeaveTime(room[1], client);
    });
  }

  handleDisconnect(client: SocketWithAuth) {}

  @SubscribeMessage(EventPatternChat.createRoom)
  @AsyncApiPub({
    channel: EventPatternChat.createRoom,
    description: 'Create a new chat room',
    message: {
      payload: CreateRoomDto,
    },
  })
  async handleCreateRoom(@ConnectedSocket() client: SocketWithAuth, @MessageBody() createRoomDto: CreateRoomDto) {
    return this.chatService.createRoom(client, createRoomDto);
  }

  @SubscribeMessage(EventPatternChat.joinRoom)
  @AsyncApiPub({
    channel: EventPatternChat.joinRoom,
    description: 'Join an existing chat Room',
    message: {
      payload: JoinRoomDto,
    },
  })
  @AsyncApiSub({
    channel: EventPatternChat.listenMessage,
    description: 'Listen to chat messages on join',
    message: {
      payload: NewMessageDto,
    },
  })
  handleJoinRoom(@ConnectedSocket() client: SocketWithAuth, @MessageBody() joinRoomDto: JoinRoomDto) {
    return this.chatService.joinRoom(client, joinRoomDto, this.io);
  }

  @SubscribeMessage(EventPatternChat.sendMessage)
  @AsyncApiPub({
    channel: EventPatternChat.sendMessage,
    description: 'Send New message -- ONLY AFTER JOIN ROOM',
    message: {
      payload: NewMessageDto,
    },
  })
  async handleNewMessage(client: SocketWithAuth, newMessageDto: NewMessageDto) {
    return this.chatService.createMessage(client, newMessageDto);
  }
}
