import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { UserDocument } from 'src/users/user.schema';
import { UserByIdPipe } from 'src/users/utils/user.pipe';
import { Protect } from 'src/utils/decorator/auth.decorator';
import { ConnectedUser } from 'src/utils/decorator/customAuth.decorator';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './utils/dto/request/create-story.dto';
import { GetStoryLightDto } from './utils/dto/response/get-stories-light.dto';
import { GetStoryDto } from './utils/dto/response/get-story.dto';

@ApiTags('Stories')
@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Protect()
  @Post()
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create Story' })
  @ApiOkResponse({ description: 'SUCCESS', type: GetStoryDto })
  create(@ConnectedUser() user: UserDocument, @Body() createStoryDto: CreateStoryDto) {
    return this.storiesService.createStory(user, createStoryDto);
  }

  @Protect()
  @Get()
  @ApiOperation({ summary: 'Get Following Stories' })
  @ApiOkResponse({ description: 'SUCCESS', type: [GetStoryLightDto] })
  getTodayStories(@ConnectedUser() user: UserDocument) {
    return this.storiesService.getTodayUserWithStories(user);
  }

  @Protect()
  @Get(':ownerId')
  @ApiParam({ name: 'ownerId', type: String })
  @ApiOperation({ summary: 'Get User Stories' })
  @ApiOkResponse({ description: 'SUCCESS', type: [GetStoryDto] })
  @ApiUnauthorizedResponse({ description: 'NOT_FOLLOWING_USER' })
  getStory(@ConnectedUser() user: UserDocument, @Param('ownerId', UserByIdPipe) storyOwner: UserDocument) {
    return this.storiesService.getUserStories(user, storyOwner);
  }
}
