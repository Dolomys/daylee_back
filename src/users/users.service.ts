import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserMapper } from './user.mapper';
import { UserDocument } from './user.schema';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './utils/dto/request/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userMapper: UserMapper,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  getUser = (user: UserDocument) =>
    this.userRepository.findOneById(user._id).then((user) => this.userMapper.toGetUserDto(user));

  async updateUser(user: UserDocument, updateUserDto: UpdateUserDto) {
    let avatarUrl;
    if (updateUserDto.image) avatarUrl = await this.cloudinaryService.uploadImageAndGetUrl(updateUserDto.image);

    return this.userRepository
      .updateUser(user._id, {
        username: updateUserDto.username,
        avatarUrl: avatarUrl,
      })
      .then((user) => this.userMapper.toGetUserDto(user));
  }
}
