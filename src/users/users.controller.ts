import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { Protect } from 'src/utils/decorator/auth.decorator';
import { ConnectedUser } from 'src/utils/decorator/customAuth.decorator';
import { UserDocument } from './user.schema';
import { UsersService } from './users.service';
import { UpdateUserDto } from './utils/dto/request/update-user.dto';
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

  @Protect()
  @Patch()
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'userId', type: String })
  @ApiOperation({ summary: 'Get User By ID' })
  @ApiOkResponse({ description: 'SUCCESS', type: GetUserDto })
  updateConnectedUser(@ConnectedUser() user: UserDocument,@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(user,updateUserDto);
  }
}
