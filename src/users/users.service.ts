import { Injectable } from '@nestjs/common';
import { GetUserAuthDto } from './dto/response/getUserAuth.dto';
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
    const user = this.userRepository.findOne({ username: username });
    return user;
  }

  async createUser(user: User): Promise<GetUserAuthDto> {
    const newUser = await this.userRepository.createOne(user);
    return this.userMapper.toGetUserDto(newUser);
  }
}
