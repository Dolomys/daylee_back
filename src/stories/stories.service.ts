import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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
    const { secure_url, public_id } = await this.cloudinaryService.uploadFileAndGetUrl(createStoryDto.file);
    return this.storiesRepository
      .create({ fileUrl: secure_url, fileId: public_id, owner: user })
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
    if (user.id !== storyOwner.id && !isFollower) throw new UnauthorizedException('NOT_FOLLOWING_USER');
    const story = await this.storiesRepository.findByUser(storyOwner);
    return this.storiesMapper.toGetStoriesDtos(story);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteStory() {
    try {
      const storiesToDelete = await this.storiesRepository.findOldStories();
      if (storiesToDelete.length > 0) {
        const storiesFiles = storiesToDelete.map(({ fileId, ...removeAttr }) => fileId);
        await this.cloudinaryService.deleteFiles(storiesFiles);
        await this.storiesRepository.deleteMany(storiesToDelete);
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
