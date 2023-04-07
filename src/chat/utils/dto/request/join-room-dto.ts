import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsMongoId } from 'class-validator';
export class JoinRoomDto {
  @ApiProperty()
  @IsMongoId()
  roomId: string;
}
