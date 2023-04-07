import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsMongoId, IsString } from 'class-validator';

export class NewMessageDto {
  @ApiProperty()
  @IsMongoId()
  roomId: string;

  @ApiProperty()
  @IsString()
  message: string;
}
