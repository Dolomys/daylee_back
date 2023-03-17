import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './chat.repository';
import { Chat, ChatRoom, ChatRoomSchema, ChatSchema } from './chat.schema';
import { ChatService } from './chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: ChatRoom.name, schema: ChatRoomSchema }]),
    forwardRef(()=> UsersModule)
  ],
  providers: [ChatGateway, ChatRepository, ChatService],
  controllers: [ChatController],
  exports: [ChatGateway, ChatRepository, ChatService],
})
export class ChatModule {}
