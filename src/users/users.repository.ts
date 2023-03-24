import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { FilterAndPaginateDto } from './utils/dto/request/filter-user.dto';

const PAGINATE_QUERY_LIMIT = 10;
@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: mongoose.PaginateModel<UserDocument>) {}

  async orThrow<T>(x: T | null) {
    if (x == null) throw new NotFoundException('User not found');
    return x;
  }

  findManyById = (usersIds: Types.ObjectId[]) =>
    this.userModel
      .find({ _id: { $in: usersIds } })
      .exec()
      .then(this.orThrow);

  async findManyWithFilter(filterAndPaginateDto: FilterAndPaginateDto) {
    const options = {
      page: filterAndPaginateDto.page ?? 1,
      limit: PAGINATE_QUERY_LIMIT,
    };
    const filter = filterAndPaginateDto.query ? { username: { $regex: filterAndPaginateDto.query, $options: 'i' } } : {};
    return await this.userModel.paginate(filter, options);
  }

  findOneByEmail = (email: string) => this.userModel.findOne({ email: email }).exec();

  findOneByUsername = (username: string) => this.userModel.findOne({ username: username }).exec();

  findOneById = (userId: Types.ObjectId) => this.userModel.findOne({ _id: userId }).exec().then(this.orThrow);

  createOne = (user: User) => this.userModel.create(user);

  updateUser = (userId: Types.ObjectId, newUser: Partial<User>) =>
    this.userModel.findOneAndUpdate({ _id: userId }, newUser, { new: true }).exec().then(this.orThrow);

  async addFollowCount(follower: UserDocument, following: UserDocument) {
    await this.userModel
      .findOneAndUpdate({ _id: following }, { $inc: { followersCount: 1 } })
      .exec()
      .then(this.orThrow);
    await this.userModel
      .findOneAndUpdate({ _id: follower }, { $inc: { followingsCount: 1 } })
      .exec()
      .then(this.orThrow);
  }

  addFollowingSlots = (user: UserDocument, slots: number) =>
    this.userModel
      .findOneAndUpdate({ _id: user }, { $push: { followingSlots: slots } })
      .exec()
      .then(this.orThrow);
}
