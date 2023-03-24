import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { HasMimeType, IsFiles, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  description: string;


  @ApiProperty({
    type: 'file',
    isArray: true,
    description: 'An array of files (images and videos)',
  })
  @IsFiles()
  @MaxFileSize(1e6, { each: true })
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  images: MemoryStoredFile[];
}
