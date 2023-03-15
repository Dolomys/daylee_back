import { IsString } from 'class-validator';
import { CreateRoomDto } from './create-room.dto';

export class JoinRoomDto extends CreateRoomDto {
  @IsString()
  roomId: string;
}
