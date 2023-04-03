import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { subHours } from 'date-fns';
import { Model, Types } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { CreateStoryType } from 'src/utils/types';
import { Story, StoryDocument } from './story.schema';

@Injectable()
export class StoriesRepository {
  constructor(@InjectModel(Story.name) private storyModel: Model<StoryDocument>) {}

  async orThrow<T>(x: T | null) {
    if (x == null) throw new NotFoundException('Story not found');
    return x;
  }

  create = (story: CreateStoryType) => this.storyModel.create(story);

  findOne = (storyId: Types.ObjectId) => this.storyModel.findById(storyId).populate('owner').exec().then(this.orThrow);

  findByUser = (user: UserDocument) => this.storyModel.find({owner: user}).populate('owner').exec().then(this.orThrow)

  findFollowing = (following: UserDocument[]) => {
    const date24HoursAgo = subHours(new Date(), 24);
    return this.storyModel
      .find({
        owner: {
          $in: following,
        },
        createdAt: {
          $gte: date24HoursAgo,
        },
      })
      .populate('owner')
      .then(this.orThrow);
  };

  delete = (story: StoryDocument) => this.storyModel.deleteOne({ id: story.id }).then(this.orThrow);
}
