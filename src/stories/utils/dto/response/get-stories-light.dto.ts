import { ApiProperty } from '@nestjs/swagger';
import { GetUserDtoLight } from 'src/users/utils/dto/response/get-user-light.dto';

export class GetStoryLightDto {
  @ApiProperty()
  storyId: string;

  @ApiProperty()
  owner: GetUserDtoLight;
}
