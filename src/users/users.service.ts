import { Injectable } from '@nestjs/common';
import { UserMapper } from './user.mapper';
import { User, UserDocument } from './user.schema';
import { UsersRepository } from './users.repository';
import { GetUserDtoLight } from './utils/dto/response/get-user-light.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository, private readonly userMapper: UserMapper) {}

  getUser = (user: UserDocument) => 
    this.userRepository.findOneById(user._id).then(user => this.userMapper.toGetUserDto(user))
  
  createUser = (user: User): Promise<GetUserDtoLight> =>
    this.userRepository.createOne(user).then((newUser) => this.userMapper.toGetUserLightDto(newUser));

}
