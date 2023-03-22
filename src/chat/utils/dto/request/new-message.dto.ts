import { IsMongoId, IsString } from 'class-validator';

export class NewMessageDto {
  @IsString()
  @IsMongoId()
  roomId: string;

  @IsString()
  message: string;
}
