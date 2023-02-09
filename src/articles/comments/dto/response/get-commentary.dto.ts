import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from 'src/users/dto/response/get-user-auth.dto';

export class GetCommentaryDto {
  @ApiProperty()
  content: string;

  @ApiProperty({ type: GetUserDto })
  owner: GetUserDto;

  @ApiProperty()
  id: string;
}
