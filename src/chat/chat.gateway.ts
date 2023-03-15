import { Bind } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { Namespace, Socket } from 'Socket.io';
import { ChatRepository } from './chat.repository';
import { Chat } from './chat.schema';
import { ChatService } from './chat.service';

@WebSocketGateway({namespace: 'chat'})
export class ChatGateway implements NestGateway {
  constructor(private readonly chatService: ChatService, private readonly chatRepository: ChatRepository) {}
  
  @WebSocketServer()
  io: Namespace;

  afterInit(server: any) {
  }

  handleConnection(client: Socket) {
    const sockets = this.io.sockets
    console.log(sockets.size)
  }

  handleDisconnect(socket: any) {
  }

  
  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage('chat')
  async handleNewMessage(chat: Chat, sender: any) {
    const newChat: Chat = {
      message: chat.message,
      sender: chat.sender,
      recipient: chat.recipient,
    };

    await this.chatRepository.saveChat(newChat);
    this.io.emit('newChat', chat);
    sender.broadcast.emit('newChat', chat);
  }
}
