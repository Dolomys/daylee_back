import { Injectable } from '@nestjs/common';
import { UserMapper } from 'src/users/user.mapper';
import { StoryDocument } from './story.schema';
import { GetStoryDto } from './utils/dto/response/get-story.dto';

@Injectable()
export class StoriesMapper {
  constructor(private readonly userMapper: UserMapper) {}

  toGetStoriesDtos = (stories: StoryDocument[]) => stories.map((story) => this.toGetStoryDto(story));

  toGetStoryDto = (story: StoryDocument): GetStoryDto => ({
    fileUrl: story.fileUrl,
    createdAt: story.createdAt,
  });

  toGetStoryUserSet = (stories: StoryDocument[]) => {
    const ownerArray = stories.map(({ owner, ...removeAttr }) => owner);
    return [...new Set(ownerArray)].map((owner) => this.userMapper.toGetUserLightDto(owner));
  };
}
