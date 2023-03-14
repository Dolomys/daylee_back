import { Injectable } from '@nestjs/common';
import { UserDocument } from './user.schema';
import { GetUserDtoLight } from './utils/dto/response/get-user-light.dto';
import { GetUserDto } from './utils/dto/response/get-user.dto';

@Injectable()
export class UserMapper {
  toGetUsersLightListDto = (users: UserDocument[]) => users.map((user) => this.toGetUserLightDto(user));

  toGetUserLightDto = (user: UserDocument): GetUserDtoLight => ({
    id: user.id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl
  });

  toGetUserDto = (user: UserDocument): GetUserDto => ({
    id: user.id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    followersCount: user.followersCount,
    followingSlots: user.followingSlots,
    followingsCount: user.followingsCount,
  })
}
