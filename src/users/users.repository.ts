import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findOne(userQueryFilter: FilterQuery<User>): Promise<User> {
    const user = this.userModel.findOne(userQueryFilter).exec();
    if (!user) throw new NotFoundException();
    return user;
  }

  createOne(user: User) {
    const newUser = new this.userModel(user);
    try {
      return newUser.save();
    } catch (err) {
      throw new ConflictException('Username already exist');
    }
  }
}
