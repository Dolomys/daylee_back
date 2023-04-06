import { Injectable } from '@nestjs/common';
import { UserMapper } from 'src/users/user.mapper';
import { UserDocument } from 'src/users/user.schema';
import { ChatRepository } from './chat.repository';
import { ChatDocument, ChatRoomDocument } from './chat.schema';
import { GetMessageDto } from './utils/dto/response/get-message.dto';
import { GetRoomDto } from './utils/dto/response/get-rooms.dto';

@Injectable()
export class ChatMapper {
  constructor(private readonly userMapper: UserMapper, private readonly chatRepository: ChatRepository) {}

  toGetRoomMessagesDto = (messages: ChatDocument[]) => messages.map((message) => this.toGetMessageDto(message));

  toGetMessageDto = (chatDocument: ChatDocument): GetMessageDto => ({
    sender: this.userMapper.toGetUserLightDto(chatDocument.sender),
    content: chatDocument.message,
  });

  toGetRoomsDto = (rooms: ChatRoomDocument[], user: UserDocument) =>
    Promise.all(rooms.map((room) => this.toGetRoomDto(room, user)));

  async toGetRoomDto(room: ChatRoomDocument, user: UserDocument): Promise<GetRoomDto> {
    const lastSeenMessage = await this.chatRepository.getLastRoomMessage(room.id);
    const participantLastSeen = room.participantsLastSeen?.find((x) => (x.userId = user.id));
    let hasSeenLastMessage: boolean = true;
    if (lastSeenMessage.createdAt && participantLastSeen) {
      if (lastSeenMessage.createdAt > participantLastSeen?.lastDisconnect) hasSeenLastMessage = false;
    }
    return {
      roomId: room.id,
      participants: this.userMapper.toGetUsersLightListDto(room.participants),
      hasSeenLastMessage: hasSeenLastMessage,
    };
  }
}
