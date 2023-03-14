import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';
import { Follow, FollowDocument } from './follow.schema';

@Injectable()
export class FollowRepository {
  constructor(@InjectModel(Follow.name) private followModel: Model<FollowDocument>) {}

  async orThrow<T>(x: T | null) {
    if (x == null) throw new NotFoundException('not found');
    return x;
  }

  async orThrowArray<T>(x: T[]) {
    if (x.length == 0) {
      throw new NotFoundException('No element found');
    }
    return x;
  }

  followUserOrThrow = (follower: UserDocument, following: UserDocument) =>
    this.followModel.create({ follower: follower, following: following });

  getUserFollowersByIdOrThrow = (userId: string) =>
    this.followModel
      .aggregate([
        {
          $lookup: {
            from: User.name,
            as: 'follower',
            localField: 'follower',
            foreignField: '_id',
          },
        },
        { $match: { following: { $in: [userId] } } },
        { $unwind: '$follower' },
      ])
      .exec()
      .then(this.orThrowArray);

  getUserFollowingsByIdOrThrow = (userId: string) =>
    this.followModel
      .aggregate([
        {
          $lookup: {
            from: User.name,
            as: 'following',
            localField: 'following',
            foreignField: '_id',
          },
        },
        { $match: { follower: { $in: [userId] } } },
        { $unwind: '$following' },
      ])
      .exec()
      .then(this.orThrowArray);
}
