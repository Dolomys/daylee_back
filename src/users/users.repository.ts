import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findOne(userQueryFilter: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(userQueryFilter).exec();
  }

  createOne(user: User) {
    return this.userModel.create(user);
  }
}
