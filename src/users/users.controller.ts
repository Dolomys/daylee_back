import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserDocument } from './user.schema';
import { UsersService } from './users.service';
import { GetUserDto } from './utils/dto/response/get-user.dto';
import { UserByIdPipe } from './utils/user.pipe';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  @ApiParam({ name: 'userId', type: String })
  @ApiOperation({ summary: 'Get User By ID' })
  @ApiOkResponse({ description: 'SUCCESS', type: GetUserDto })
  getUser(@Param('userId', UserByIdPipe) user: UserDocument) {
    return this.usersService.getUser(user);
  }
}
