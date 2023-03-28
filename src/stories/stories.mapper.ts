import { Injectable } from '@nestjs/common';
import { UserMapper } from 'src/users/user.mapper';
import { StoryDocument } from './story.schema';
import { GetStoryLightDto } from './utils/dto/response/get-stories-light.dto';
import { GetStoryDto } from './utils/dto/response/get-story.dto';

@Injectable()
export class StoriesMapper {
  constructor(private readonly userMapper: UserMapper) {}

  toGetStoryDto = (story: StoryDocument): GetStoryDto => ({
    filesUrl: story.filesUrls,
    owner: this.userMapper.toGetUserLightDto(story.owner),
  });

  toGetStoryLightListDto = (stories: StoryDocument[]) => stories.map((story) => this.toGetStoryLightDto(story));

  toGetStoryLightDto = (story: StoryDocument): GetStoryLightDto => ({
    storyId: story.id,
    owner: this.userMapper.toGetUserLightDto(story.owner),
  });
}
