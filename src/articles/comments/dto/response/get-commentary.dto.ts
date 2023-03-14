import { ApiProperty } from '@nestjs/swagger';
import { GetUserDtoLight } from 'src/users/utils/dto/response/get-user-light.dto';
import { CommentDocument } from '../../comment.schema';

export class GetCommentaryDto {
  @ApiProperty()
  content: string;

  @ApiProperty({ type: GetUserDtoLight })
  owner: GetUserDtoLight;

  @ApiProperty()
  id: string;

  @ApiProperty({type: GetCommentaryDto})
  parentComment?: CommentDocument
}
