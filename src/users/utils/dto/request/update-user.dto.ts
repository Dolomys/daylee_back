import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username: string;

  @ApiPropertyOptional({ type: 'file' })
  @IsOptional()
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png'])
  image?: MemoryStoredFile;
}
