import { ApiProperty } from '@nestjs/swagger';

export class GetStoryDto {
  @ApiProperty()
  fileUrl: string;
  
  @ApiProperty({type: Date})
  createdAt?: Date
}
