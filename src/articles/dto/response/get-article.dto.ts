import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GetCommentaryDto } from 'src/articles/comments/dto/response/get-commentary.dto';

export class GetArticleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

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
  photoUrl?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  owner: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  comments?: GetCommentaryDto[];
}
