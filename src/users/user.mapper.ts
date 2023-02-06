import { Injectable } from '@nestjs/common';
import { GetUserAuthDto } from './dto/response/getUserAuth.dto';
import { User } from './user.schema';

@Injectable()
export class UserMapper {
  toGetUserDto = (user: User): GetUserAuthDto => ({
    token: user.token,
    email: user.email,
    username: user.username,
  });
}
