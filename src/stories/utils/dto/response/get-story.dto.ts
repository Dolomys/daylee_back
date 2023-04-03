import { ApiProperty } from '@nestjs/swagger';

export class GetStoryDto {
  @ApiProperty()
  filesUrl: string[];
}
