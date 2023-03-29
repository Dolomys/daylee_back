import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ArticleDocument } from 'src/articles/article.schema';
import { UserDocument } from 'src/users/user.schema';
import { Like, LikeDocument } from './likes.schema';

@Injectable()
export class LikesRepository {
  constructor(@InjectModel(Like.name) private likeModel: Model<LikeDocument>) {}

  async orThrow<T>(x: T | null) {
    if (x == null) throw new NotFoundException('follow not found');
    return x;
  }

  findArticleLike = (article: ArticleDocument, user: UserDocument) =>
    this.likeModel.findOne({ entity: article, owner: user }).exec();

  create = (like: any) => this.likeModel.create(like);

  findOne = (likeId: Types.ObjectId) => this.likeModel.findById(likeId).populate('owner').exec().then(this.orThrow);

  delete = (like: LikeDocument) => this.likeModel.deleteOne({ id: like.id }).populate('owner').exec().then(this.orThrow);

  findArticleLikes = (article: ArticleDocument) =>
    this.likeModel.find({ entity: article }).populate('owner').exec().then(this.orThrow);
}
