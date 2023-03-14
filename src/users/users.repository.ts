import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async orThrow<T>(x: T | null) {
    if (x == null) throw new NotFoundException('User not found');
    return x;
  }

  findOneByUsername = (username: string) => 
    this.userModel.findOne({ username: username }).exec();

  findOneById = (userId: Types.ObjectId) => 
    this.userModel.findOne({ _id: userId }).exec().then(this.orThrow);

  createOne = (user: User) => 
    this.userModel.create(user);

  async addFollowCount(follower: UserDocument, following: UserDocument){
    await this.userModel.findOneAndUpdate({ _id: following}, {$inc: {followersCount: 1}}).exec().then(this.orThrow)
    await this.userModel.findOneAndUpdate({ _id: follower}, {$inc: {followingsCount: 1}}).exec().then(this.orThrow)
  }

  addFollowingSlots = (user: UserDocument, slots: number) =>
  this.userModel.findOneAndUpdate({ _id: user},{$push: {followingSlots: slots}}).exec().then(this.orThrow)

  }
