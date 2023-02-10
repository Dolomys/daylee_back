import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Categories } from 'src/articles/utils/category/category.enum';

export class CreateArticleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: ['Sport', 'Manga', 'Lifestyle', 'Various'] })
  @IsEnum(Categories)
  @IsNotEmpty()
  category: Categories = Categories.Various;

  @ApiProperty()
  @IsString()
  @IsOptional()
  photoUrl?: string;
}
