import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { GetUserDtoLight } from 'src/users/utils/dto/response/get-user-light.dto';

export class GetArticleDto {
  @ApiProperty()
  id: Types.ObjectId;

  @ApiProperty()
  content: string;

  @ApiProperty()
  photoUrls: string[];

  @ApiProperty()
  owner: GetUserDtoLight;
}
