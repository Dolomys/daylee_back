import { Injectable } from '@nestjs/common';
import { UserMapper } from 'src/users/user.mapper';
import { ChatDocument } from './chat.schema';
import { GetMessageDto } from './utils/dto/response/get-message.dto';

@Injectable()
export class ChatMapper {
  constructor(private readonly userMapper: UserMapper) {}

  toGetRoomMessagesDto = (messages: ChatDocument[]) => messages.map((message) => this.toGetMessageDto(message));

  toGetMessageDto = (chatDocument: ChatDocument): GetMessageDto => ({
    sender: this.userMapper.toGetUserLightDto(chatDocument.sender),
    content: chatDocument.message,
  });
}
