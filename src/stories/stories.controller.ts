import { Body, Controller, Get, Param, ParseFilePipe, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { Protect } from 'src/utils/decorator/auth.decorator';
import { ConnectedUser } from 'src/utils/decorator/customAuth.decorator';
import { CustomFilesTypeValidator } from 'src/utils/validator/file.validator';
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
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create Story' })
  @ApiOkResponse({ description: 'SUCCESS', type: GetStoryDto })
  create(
    @ConnectedUser() user: UserDocument,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new CustomFilesTypeValidator({})],
      }),
    )
    files: Express.Multer.File[],
    @Body() createStoryDto: CreateStoryDto,
  ) {
    return this.storiesService.createStory(user, files);
  }

  @Protect()
  @Get()
  @ApiOperation({ summary: 'Get Following Stories' })
  @ApiOkResponse({ description: 'SUCCESS', type: [GetStoryLightDto] })
  getTodayStories(@ConnectedUser() user: UserDocument) {
    return this.storiesService.getTodayStory(user);
  }

  @Protect()
  @Get(':storyId')
  @ApiParam({ name: 'storyId', type: String })
  @ApiOperation({ summary: 'Get Single Story' })
  @ApiOkResponse({ description: 'SUCCESS', type: GetStoryDto })
  getStory(@ConnectedUser() user: UserDocument, @Param('storyId') storyId: Types.ObjectId) {
    return this.storiesService.getStoryById(user, storyId);
  }
}
