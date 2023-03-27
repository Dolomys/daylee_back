import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({
    type: 'file',
    isArray: true,
    description: 'An array of files (images and videos)',
  })
  images: Express.Multer.File[];
}
