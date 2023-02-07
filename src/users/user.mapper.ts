import { Injectable } from '@nestjs/common';
import { GetUserAuthDto } from './dto/response/get-user-auth.dto';

@Injectable()
export class UserMapper {
  toGetUserDto = (user: any): GetUserAuthDto => ({
    token: user.token,
    email: user.email,
    username: user.username,
  });
}
