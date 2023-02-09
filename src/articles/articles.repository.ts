import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Article, ArticleDocument } from './article.schema';

@Injectable()
export class ArticleRepository {
  constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}

  async orThrow<T>(x: T | null) {
    if (x == null) throw new NotFoundException('Article not found');
    return x;
  }

  create(article: Article): Promise<ArticleDocument> {
    return this.articleModel.create(article);
  }

  findAll(articleFilterQuery?: FilterQuery<Article>): Promise<ArticleDocument[]>{
    return this.articleModel.find(articleFilterQuery ?? {}).populate('owner').exec()
  }

  findOneById(articleId: string): Promise<ArticleDocument> {
    return this.articleModel.findOne({ _id: articleId }).populate('owner').exec().then(this.orThrow);
  }

  update(articleToUpdate: ArticleDocument, newArticle: Partial<Article>): Promise<ArticleDocument> {
    return this.articleModel
      .findOneAndUpdate({ _id: articleToUpdate.id }, newArticle, { new: true })
      .populate('owner')
      .exec()
      .then(this.orThrow);
  }

  delete(articleFilterQuery: FilterQuery<Article>): Promise<ArticleDocument> {
    return this.articleModel.findOneAndRemove(articleFilterQuery).exec().then(this.orThrow);
  }
}
