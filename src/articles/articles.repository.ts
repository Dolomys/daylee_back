import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { Article, ArticleDocument } from './article.schema';

@Injectable()
export class ArticleRepository {
  constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}

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

  create = (article: Article) => this.articleModel.create(article);

  findAll = () => this.articleModel.find().populate('owner').exec().then(this.orThrowArray);

  findOneById = (articleId: string) =>
    this.articleModel.findOne({ _id: articleId }).populate('owner').exec().then(this.orThrow);

  update = (articleToUpdate: ArticleDocument, newArticle: Partial<Article>): Promise<ArticleDocument> =>
    this.articleModel
      .findOneAndUpdate({ _id: articleToUpdate.id }, newArticle, { new: true })
      .populate('owner')
      .exec()
      .then(this.orThrow);

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
