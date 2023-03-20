import { IsString } from 'class-validator';

export class NewMessageDto {
  @IsString()
  roomId: string;

  @IsString()
  message: string;
}
