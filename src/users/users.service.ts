import { Injectable } from '@nestjs/common';
import { GetUserAuthDto } from './dto/response/get-user-auth.dto';
import { UserMapper } from './user.mapper';
import { User } from './user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userMapper: UserMapper,
  ) {}

  findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ username: username });
  }

  async createUser(user: User): Promise<GetUserAuthDto> {
    const newUser = await this.userRepository.createOne(user);
    return this.userMapper.toGetUserDto(newUser);
  }

  async getUsernameById(userId: string): Promise<string> {
    return this.userRepository
      .findOne({ _id: userId })
      .then((user) => user.username);
  }
}
