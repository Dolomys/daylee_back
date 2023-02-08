import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Article, ArticleDocument } from './article.schema';

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  create(article: Article): Promise<Article> {
    return this.articleModel.create(article);
  }

  findAll(): Promise<Article[]> {
    return this.articleModel.find().populate('owner', 'username').exec();
  }

  findOne(articleFilterQuery: FilterQuery<Article>): Promise<Article> {
    return this.articleModel
      .findOne(articleFilterQuery)
      .populate('owner', 'username')
      .exec();
  }

  update(
    articleFilterQuery: FilterQuery<Article>,
    article: Partial<Article>,
  ): Promise<Article> {
    return this.articleModel
      .findOneAndUpdate(articleFilterQuery, article, { new: true })
      .exec();
  }

  delete(articleFilterQuery: FilterQuery<Article>): Promise<Article> {
    return this.articleModel.findOneAndRemove(articleFilterQuery).exec();
  }
}
