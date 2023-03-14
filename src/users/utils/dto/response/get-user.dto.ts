import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatarUrl?: string;

  @ApiProperty()
  followersCount: number;

  @ApiProperty()
  followingSlots: number;

  @ApiProperty()
  followingsCount: number;
}
