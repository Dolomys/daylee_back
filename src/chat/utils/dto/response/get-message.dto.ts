import { ApiProperty } from '@nestjs/swagger';
import { GetUserDtoLight } from 'src/users/utils/dto/response/get-user-light.dto';

export class GetMessageDto {
  @ApiProperty({ type: GetUserDtoLight })
  sender: GetUserDtoLight;

  @ApiProperty()
  content: string;
}
