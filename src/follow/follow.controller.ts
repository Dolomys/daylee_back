import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { Delete, Get, Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDocument } from 'src/users/user.schema';
import { GetUserDtoLight } from 'src/users/utils/dto/response/get-user-light.dto';
import { UserByIdPipe } from 'src/users/utils/user.pipe';
import { Protect, ProtectFollow } from 'src/utils/decorator/auth.decorator';
import { ConnectedUser } from 'src/utils/decorator/customAuth.decorator';
import { FollowService } from './follow.service';

@ApiTags('Follow')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Protect()
  @Get('followers')
  @ApiOperation({ summary: 'Get User Followers List' })
  @ApiOkResponse({ description: 'SUCCESS', type: [GetUserDtoLight] })
  getUserFollowers(@ConnectedUser() user: UserDocument) {
    return this.followService.getUserFollowers(user);
  }

  @Protect()
  @Get('following')
  @ApiOperation({ summary: 'Get User Following List' })
  @ApiOkResponse({ description: 'SUCCESS', type: [GetUserDtoLight] })
  getUserFollowing(@ConnectedUser() user: UserDocument) {
    return this.followService.getUserFollowing(user);
  }

  @Protect()
  @Post('follow/:userId')
  @ApiParam({ name: 'userId', type: String })
  @ApiOperation({ summary: 'Follow user by ID' })
  @ApiNoContentResponse({ description: 'SUCCESS' })
  @ApiUnauthorizedResponse({ description: 'FOLLOWING_LIMIT_REACHED, CANNOT_FOLLOW_YOURSELF, ALREADY_FOLLOWING' })
  followUser(@ConnectedUser() user: UserDocument, @Param('userId', UserByIdPipe) userToFollow: UserDocument) {
    this.followService.followUser(user, userToFollow);
  }

  @ProtectFollow()
  @Delete('unfollow/:userId')
  @ApiParam({ name: 'userId', type: String })
  @ApiOperation({ summary: 'Unfollow user by ID' })
  @ApiNoContentResponse({ description: 'SUCCESS' })
  unFollowUser(@ConnectedUser() user: UserDocument, @Param('userId', UserByIdPipe) userToUnfollow: UserDocument) {
    return this.followService.removeFollowing(user, userToUnfollow);
  }

  @ProtectFollow()
  @Delete('removeFollower/:userId')
  @ApiParam({ name: 'userId', type: String })
  @ApiOperation({ summary: 'Remove Follower by ID' })
  @ApiNoContentResponse({ description: 'SUCCESS' })
  removeFollower(@ConnectedUser() user: UserDocument, @Param('userId', UserByIdPipe) userToUnfollow: UserDocument) {
    return this.followService.removeFollower(user, userToUnfollow);
  }
}
