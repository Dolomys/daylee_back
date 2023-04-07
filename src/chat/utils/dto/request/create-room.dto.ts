import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsArray, IsBoolean, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRoomDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  participantsId: Types.ObjectId[];

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isPrivate: boolean;
}
