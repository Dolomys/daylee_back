import { ApiProperty } from '@nestjs/swagger';

export class CreateStoryDto {
  @ApiProperty({
    type: 'file',
    isArray: true,
    description: 'An array of files (images and videos)',
  })
  files: Express.Multer.File[];
}
