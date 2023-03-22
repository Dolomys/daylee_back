import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserDocument } from 'src/users/user.schema';
import { Protect } from 'src/utils/decorator/auth.decorator';
import { ConnectedUser } from 'src/utils/decorator/customAuth.decorator';
import { ChatService } from './chat.service';

@ApiTags('Chats')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Protect()
  @Get()
  @ApiOperation({ summary: 'Get All User Chats' })
  @ApiOkResponse({ description: 'SUCCESS' })
  getUser(@ConnectedUser() user: UserDocument) {
    return this.chatService.getUsersRooms(user);
  }

  @Protect()
  @Get(':roomId')
  @ApiParam({ name: 'roomId', type: String })
  @ApiOperation({ summary: 'Get All Messages From Room' })
  @ApiOkResponse({ description: 'SUCCESS' })
  getRoomMessagesPaginated(@ConnectedUser() user: UserDocument, @Param('roomId') roomId: string) {
    return this.chatService.getRoomMessages(roomId, user);
  }
}
