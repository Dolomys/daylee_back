import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FollowRepository } from 'src/follow/follow.repository';
import { UserDocument } from 'src/users/user.schema';
import { StoriesMapper } from './stories.mapper';
import { StoriesRepository } from './stories.repository';

@Injectable()
export class StoriesService {
  constructor(
    private readonly storiesRepository: StoriesRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly followRepository: FollowRepository,
    private readonly storiesMapper: StoriesMapper,
  ) {}

  async createStory(user: UserDocument, files: Express.Multer.File[]) {
    const photoUrls = await this.cloudinaryService.uploadManyFilesAndGetUrl(files);
    return this.storiesRepository
      .create({ filesUrls: photoUrls, owner: user })
      .then((story) => this.storiesMapper.toGetStoryDto(story));
  }

  async getTodayStory(user: UserDocument) {
    const followingUsers = await this.followRepository.getUserFollowingsByIdOrThrow(user.id);
    const formatedArray = followingUsers.map((item) => item.following);
    return this.storiesRepository
      .findFollowing(formatedArray)
      .then((stories) => this.storiesMapper.toGetStoryLightListDto(stories));
  }

  async getStoryById(user: UserDocument, storyId: Types.ObjectId) {
    const story = await this.storiesRepository.findOne(storyId);
    const isFollower = this.followRepository.isFollowing(user, story.owner.id);
    if (!isFollower) throw new UnauthorizedException('NOT_FOLLOWING_USER');
    return this.storiesMapper.toGetStoryDto(story);
  }
}
