import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { GetUserDtoLight } from 'src/users/utils/dto/response/get-user-light.dto';

export class GetArticleLightDto {
  @ApiProperty()
  id: Types.ObjectId;

  @ApiProperty()
  description: string;

  @ApiProperty()
  photoUrls: string[];

  @ApiProperty()
  commentCount: number;

  @ApiProperty()
  likeCount: number;

  @ApiProperty()
  owner?: GetUserDtoLight;

  @ApiProperty({ type: Boolean, nullable: true })
  hasConnectedUserLiked?: boolean;
}
