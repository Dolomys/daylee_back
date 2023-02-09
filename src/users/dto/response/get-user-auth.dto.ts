import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;
}
