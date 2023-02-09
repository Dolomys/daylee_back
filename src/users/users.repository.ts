import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async orThrow<T>(x: T | null) {
    if (x == null) throw new NotFoundException('User not found');
    return x;
  }

  findOneByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username: username }).exec();
  }

  findOneById(userId: string): Promise<UserDocument> {
    return this.userModel.findOne({ _id: userId }).exec().then(this.orThrow);
  }

  createOne(user: User): Promise<UserDocument> {
    return this.userModel.create(user);
  }
}
