import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { GetCommentaryDto } from 'src/articles/comments/dto/response/get-commentary.dto';
import { Categories } from 'src/articles/utils/category.enum';
import { GetUserDto } from 'src/users/dto/response/get-user-auth.dto';

export class GetArticleDto {
  @ApiProperty()
  id: Types.ObjectId;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  category: Categories;

  @ApiPropertyOptional()
  photoUrl?: string | null;

  @ApiProperty()
  owner: GetUserDto;

  @ApiPropertyOptional()
  comments?: GetCommentaryDto[] | null;
}

export class GetArticleLightDto {
  @ApiProperty()
  id: Types.ObjectId;

  @ApiProperty()
  title: string;

  @ApiProperty()
  category: Categories

  @ApiProperty()
  owner: GetUserDto;
}
