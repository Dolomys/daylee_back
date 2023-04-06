import { ApiProperty } from '@nestjs/swagger';
import { GetUserDtoLight } from 'src/users/utils/dto/response/get-user-light.dto';

export class GetRoomDto {
  @ApiProperty()
  roomId: string;

  @ApiProperty({ type: [GetUserDtoLight] })
  participants: GetUserDtoLight[];

  @ApiProperty()
  hasSeenLastMessage: boolean;
}
