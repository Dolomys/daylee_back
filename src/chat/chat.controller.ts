import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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
}
