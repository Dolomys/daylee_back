import { IsArray, IsBoolean, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRoomDto {
  @IsArray()
  @IsNotEmpty()
  participantsId: Types.ObjectId[];

  @IsBoolean()
  @IsNotEmpty()
  isPrivate: boolean;
}
