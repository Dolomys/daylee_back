import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FollowRepository } from 'src/follow/follow.repository';
import { UserDocument } from 'src/users/user.schema';
import { StoriesMapper } from './stories.mapper';
import { StoriesRepository } from './stories.repository';
import { CreateStoryDto } from './utils/dto/request/create-story.dto';

@Injectable()
export class StoriesService {
  constructor(
    private readonly storiesRepository: StoriesRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly followRepository: FollowRepository,
    private readonly storiesMapper: StoriesMapper,
  ) {}

  async createStory(user: UserDocument, createStoryDto: CreateStoryDto) {
    const fileUrl = await this.cloudinaryService.uploadFileAndGetUrl(createStoryDto.file);
    return this.storiesRepository
      .create({ fileUrl: fileUrl, owner: user })
      .then((story) => this.storiesMapper.toGetStoryDto(story));
  }

  async getTodayUserWithStories(user: UserDocument) {
    const followingUsers = await this.followRepository.getUserFollowingsByIdOrThrow(user.id);
    const formatedArray = followingUsers.map((item) => item.following);
    return this.storiesRepository
      .findFollowing(formatedArray)
      .then((stories) => this.storiesMapper.toGetStoryUserSet(stories));
  }

  async getUserStories(user: UserDocument, storyOwner: UserDocument) {
    const isFollower = await this.followRepository.isFollowing(user, storyOwner.id);
    if (!isFollower) throw new UnauthorizedException('NOT_FOLLOWING_USER');
    const story = await this.storiesRepository.findByUser(storyOwner);
    return this.storiesMapper.toGetStoriesDtos(story);
  }
}
