import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetArticleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  
  @ApiProperty()
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  owner: string;
}
