import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentaryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}
