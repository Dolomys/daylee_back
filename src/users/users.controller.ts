import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { Protect } from 'src/utils/decorator/auth.decorator';
import { ConnectedUser } from 'src/utils/decorator/customAuth.decorator';
import { ApiPaginatedDto } from 'src/utils/tools/dto/api-pagined-dto.decorator';
import { UserMapper } from './user.mapper';
import { UserDocument } from './user.schema';
import { UsersService } from './users.service';
import { FilterAndPaginateDto } from './utils/dto/request/filter-user.dto';
import { UpdateUserDto } from './utils/dto/request/update-user.dto';
import { GetUserDtoLight } from './utils/dto/response/get-user-light.dto';
import { GetUserDto } from './utils/dto/response/get-user.dto';
import { UserByIdPipe } from './utils/user.pipe';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly userMapper: UserMapper) {}

  @Protect()
  @Get()
  @ApiOperation({ summary: 'Get all users with query' })
  @ApiPaginatedDto(GetUserDtoLight)
  getUsersWithQuery(@Query() filterAndPaginateDto: FilterAndPaginateDto) {
    return this.usersService.getPaginatedUsersWithFilter(filterAndPaginateDto);
  }

  @Get(':userId')
  @ApiParam({ name: 'userId', type: String })
  @ApiOperation({ summary: 'Get User By ID' })
  @ApiOkResponse({ description: 'SUCCESS', type: GetUserDto })
  getUser(@Param('userId', UserByIdPipe) user: UserDocument) {
    return this.userMapper.toGetUserDto(user);
  }

  @Protect()
  @Patch()
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update Connected User' })
  @ApiOkResponse({ description: 'SUCCESS', type: GetUserDto })
  updateConnectedUser(@ConnectedUser() user: UserDocument, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(user, updateUserDto);
  }
}
