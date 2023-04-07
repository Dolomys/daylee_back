import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { subHours } from 'date-fns';
import { Model, Types } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { CreateStoryType } from 'src/utils/types';
import { Story, StoryDocument } from './story.schema';

const DATE_24_HOURS_AGO = subHours(new Date(), 24);
@Injectable()
export class StoriesRepository {
  constructor(@InjectModel(Story.name) private storyModel: Model<StoryDocument>) {}

  async orThrow<T>(x: T | null) {
    if (x == null) throw new NotFoundException('Story not found');
    return x;
  }

  create = (story: CreateStoryType) => this.storyModel.create(story);

  findOne = (storyId: Types.ObjectId) => {
    return this.storyModel
      .findOne({ _id: storyId, createdAt: { $gte: DATE_24_HOURS_AGO } })
      .populate('owner')
      .exec()
      .then(this.orThrow);
  };

  findByUser = (user: UserDocument) => {
    return this.storyModel
      .find({ owner: user, createdAt: { $gte: DATE_24_HOURS_AGO } })
      .populate('owner')
      .exec()
      .then(this.orThrow);
  };
  findFollowing = (following: UserDocument[]) => {
    return this.storyModel
      .find({
        owner: {
          $in: following,
        },
        createdAt: {
          $gte: DATE_24_HOURS_AGO,
        },
      })
      .populate('owner')
      .then(this.orThrow);
  };

  findOldStories = () =>
    this.storyModel
      .find({
        createdAt: {
          $lt: DATE_24_HOURS_AGO,
        },
      })
      .exec();

  deleteMany = (stories: StoryDocument[]) => Promise.all(stories.map((story) => this.delete(story)));

  delete = (story: StoryDocument) => this.storyModel.deleteOne({ id: story.id }).then(this.orThrow);
}
