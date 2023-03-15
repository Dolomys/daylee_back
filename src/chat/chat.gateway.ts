import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { Namespace } from 'Socket.io';
import { SocketWithAuth } from 'utils/types';
import { ChatRepository } from './chat.repository';
import { Chat } from './chat.schema';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './utils/dto/request/create-room.dto';
import { JoinRoomDto } from './utils/dto/request/join-room-dto';

@WebSocketGateway({namespace: 'chat'})
export class ChatGateway implements NestGateway {
  constructor(private readonly chatService: ChatService, private readonly chatRepository: ChatRepository) {}
  
  @WebSocketServer()
  io: Namespace;

  afterInit(server: any) {
  }

  handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets
    console.log(sockets.size)
  }

  handleDisconnect(client: SocketWithAuth) {
    const currentRoom = Object.keys(client.rooms)[0]
    client.leave(currentRoom)
  }

  
  @SubscribeMessage('join')
  handleJoinRoom(@ConnectedSocket() client: SocketWithAuth, @MessageBody() joinRoomDto: JoinRoomDto ){
   this.chatService.joinRoom(client, joinRoomDto)
  }

  @SubscribeMessage('create')
  handleCreateRoom(@ConnectedSocket() client: SocketWithAuth, @MessageBody() CreateRoomDto: CreateRoomDto ){
   this.chatService.createRoom(client, CreateRoomDto)
  }
  
  @SubscribeMessage('chat')
  async handleNewMessage(client: SocketWithAuth, chat: Chat) {
    await this.chatRepository.saveChat(chat);
    console.log(Object.keys(client.rooms)[0])
    client.to(chat.roomId).emit('mesage', chat)
  }
}
