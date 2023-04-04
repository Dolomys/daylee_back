import { ApiProperty } from '@nestjs/swagger';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class CreateStoryDto {
  @ApiProperty({ type: 'file' })
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png', 'video/mp4'])
  file: MemoryStoredFile;
}
