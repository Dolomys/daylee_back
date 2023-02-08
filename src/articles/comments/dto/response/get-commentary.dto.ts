import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class GetCommentaryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  owner: object;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  id: string;
}
