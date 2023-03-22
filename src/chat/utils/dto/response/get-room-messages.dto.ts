import { ApiProperty } from '@nestjs/swagger';
import { GetMessageDto } from './get-message.dto';

export class GetRoomMessagesDto {
  @ApiProperty({ type: [GetMessageDto] })
  messages: GetMessageDto[];
}
