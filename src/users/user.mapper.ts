import { Injectable } from '@nestjs/common';
import { GetUserDto } from './dto/response/get-user-auth.dto';
import { UserDocument } from './user.schema';

@Injectable()
export class UserMapper {
  toGetUserDto = (user: UserDocument): GetUserDto => ({
    email: user.email,
    username: user.username,
  });
}
