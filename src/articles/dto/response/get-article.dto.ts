import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Comment } from 'src/articles/comments/comment.schema';

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
  comments?: Comment[]
}
