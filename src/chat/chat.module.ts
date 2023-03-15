import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './chat.repository';
import { Chat, ChatSchema } from './chat.schema';
import { ChatService } from './chat.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])],
  providers: [ChatGateway, ChatRepository, ChatService],
  exports: [ChatGateway, ChatRepository, ChatService],
})
export class ChatModule {}
