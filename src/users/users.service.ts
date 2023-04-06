import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PaginationDto } from 'src/utils/tools/dto/response/get-items-paginated.dto';
import { UserMapper } from './user.mapper';
import { UserDocument } from './user.schema';
import { UsersRepository } from './users.repository';
import { FilterAndPaginateDto } from './utils/dto/request/filter-user.dto';
import { UpdateUserDto } from './utils/dto/request/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userMapper: UserMapper,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getPaginatedUsersWithFilter(filterAndPaginateDto: FilterAndPaginateDto) {
    const users = await this.userRepository.findManyWithFilter(filterAndPaginateDto);
    return new PaginationDto(this.userMapper.toGetUsersLightListDto(users.docs), users);
  }

  async updateUser(user: UserDocument, updateUserDto: UpdateUserDto) {
    let avatarUrl;
    if (updateUserDto.image) avatarUrl = await this.cloudinaryService.uploadFileAndGetUrl(updateUserDto.image);

    return this.userRepository
      .updateUser(user._id, {
        username: updateUserDto.username,
        avatarUrl: avatarUrl,
      })
      .then((user) => this.userMapper.toGetUserDto(user));
  }
}
