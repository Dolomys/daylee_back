import { ApiProperty } from '@nestjs/swagger';

export class GetUserDtoLight {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatarUrl?: string;
}
