import { Injectable } from '@nestjs/common';
import { GetUserDto } from './dto/response/get-user-auth.dto';
import { UserMapper } from './user.mapper';
import { User, UserDocument } from './user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository, private readonly userMapper: UserMapper) {}

  findByUsername(username: string): Promise<UserDocument | null> {
    return this.userRepository.findOneByUsername(username);
  }

  async createUser(user: User): Promise<GetUserDto> {
    const newUser = await this.userRepository.createOne(user);
    return this.userMapper.toGetUserDto(newUser);
  }

  async getUsernameById(userId: string): Promise<string> {
    return this.userRepository.findOneById(userId).then((user) => user.username);
  }
}
