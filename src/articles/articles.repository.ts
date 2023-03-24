import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { PaginationOptionsDto } from 'src/utils/tools/dto/request/pagination-options.dto';
import { Article, ArticleDocument } from './article.schema';

const PAGINATE_QUERY_LIMIT = 10;

@Injectable()
export class ArticleRepository {
  constructor(@InjectModel(Article.name) private articleModel: mongoose.PaginateModel<ArticleDocument>) {}

  async orThrow<T>(x: T | null) {
    if (x == null) throw new NotFoundException('Article not found');
    return x;
  }

  async orThrowArray<T>(x: T[]) {
    if (x.length == 0) {
      throw new NotFoundException('No article found');
    }
    return x;
  }

  create = (article: any) => this.articleModel.create(article);

  async findAllWithPaginate(paginationOptionsDto: PaginationOptionsDto) {
    const options = {
      page: paginationOptionsDto.page ?? 1,
      limit: PAGINATE_QUERY_LIMIT,
      populate: 'owner',
    };
    return await this.articleModel.paginate({}, options);
  }

  async findArticleFeedPaginate(following: UserDocument[] | UserDocument, paginationOptionsDto: PaginationOptionsDto) {
    const options = {
      page: paginationOptionsDto.page ?? 1,
      limit: PAGINATE_QUERY_LIMIT,
      populate: 'owner',
    };
    return await this.articleModel.paginate(
      {
        owner: {
          $in: following,
        },
      },
      options,
    );
  }

  findAll = () => this.articleModel.find().populate('owner').exec().then(this.orThrowArray);

  findOneById = (articleId: string) =>
    this.articleModel.findOne({ _id: articleId }).populate('owner').exec().then(this.orThrow);

  delete = (articleFilterQuery: FilterQuery<Article>) =>
    this.articleModel.findOneAndRemove(articleFilterQuery).exec().then(this.orThrow);

  addLike = (article: ArticleDocument, user: UserDocument) =>
    this.articleModel
      .findOneAndUpdate({ _id: article.id }, { $push: { likes: user._id } }, { new: true })
      .populate('owner')
      .exec()
      .then(this.orThrow);

  removeLike = (article: ArticleDocument, user: UserDocument) =>
    this.articleModel
      .findOneAndUpdate({ _id: article.id }, { $pull: { likes: user._id } }, { new: true })
      .populate('owner')
      .exec()
      .then(this.orThrow);
}
