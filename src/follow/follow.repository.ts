import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { Follow, FollowDocument } from './follow.schema';

@Injectable()
export class FollowRepository {
  constructor(@InjectModel(Follow.name) private followModel: Model<FollowDocument>) {}

  async orThrow<T>(x: T | null) {
    if (x == null) throw new NotFoundException('follow not found');
    return x;
  }

  async orThrowArray<T>(x: T[]) {
    if (x.length == 0) {
      throw new NotFoundException('No follow found');
    }
    return x;
  }

  async isFollowing(follower: UserDocument, following: Types.ObjectId) {
    const follow = await this.followModel.findOne({ follower: follower, following: following }).exec();
    console.log(follow)
    return follow ? true : false;
  }

  followUserOrThrow = (follower: UserDocument, following: UserDocument) =>
    this.followModel.create({ follower: follower, following: following });

  getUserFollowersByIdOrThrow = (userId: Types.ObjectId) =>
    this.followModel.find({ following: userId }).populate('follower').select('follower').exec().then(this.orThrowArray);

  getUserFollowingsByIdOrThrow = (userId: Types.ObjectId) =>
    this.followModel
      .find({ follower: userId })
      .populate('following')
      .select('following')
      .exec()
      .then(this.orThrowArray);

  removeFollowingOrThrow = (user: UserDocument, following: UserDocument) =>
    this.followModel.findOneAndDelete({ follower: user, following: following }).exec().then(this.orThrow);

  removeFollowerOrThrow = (user: UserDocument, follower: UserDocument) =>
    this.followModel.findOneAndDelete({ following: user, follower: follower }).exec()
}
