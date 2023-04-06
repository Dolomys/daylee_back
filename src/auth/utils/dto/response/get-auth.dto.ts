import { ApiProperty } from '@nestjs/swagger';
import { GetUserDtoLight } from 'src/users/utils/dto/response/get-user-light.dto';

export class GetAuthDto {
  @ApiProperty()
  token: string;

  @ApiProperty({ type: GetUserDtoLight })
  user: GetUserDtoLight;
}
