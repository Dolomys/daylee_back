import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional({ type: 'file' })
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png'])
  image: MemoryStoredFile;
}
