import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { GetCommentaryDto } from 'src/articles/comments/dto/response/get-commentary.dto';
import { GetUserDtoLight } from 'src/users/utils/dto/response/get-user-light.dto';

export class GetArticleDto {
  @ApiProperty()
  id: Types.ObjectId;

  @ApiProperty()
  content: string;

  @ApiProperty()
  photoUrl: string;

  @ApiProperty()
  owner: GetUserDtoLight;

  @ApiPropertyOptional()
  comments?: GetCommentaryDto[] | null;
}
