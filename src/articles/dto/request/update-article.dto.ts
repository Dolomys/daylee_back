import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';
export class UpdateArticleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({ type: 'file' })
  @IsFile()
  @IsOptional()
  @HasMimeType(['image/jpeg', 'image/png'])
  avatar?: MemoryStoredFile;
}
