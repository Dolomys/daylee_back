import { IsMongoId, IsString } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  @IsMongoId()
  roomId: string;
}
