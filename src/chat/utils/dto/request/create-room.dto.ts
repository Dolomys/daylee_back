import { IsArray, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRoomDto {
  @IsArray()
  participantsId: Types.ObjectId[];

  @IsBoolean()
  isPrivate: boolean;
}
