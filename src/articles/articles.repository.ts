import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Article, ArticleDocument } from './article.schema';
import { Comment, CommentDocument } from './comments/comment.schema';

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  create(article: Article): Promise<Article> {
    return this.articleModel.create(article);
  }

  findAll(): Promise<Article[]> {
    return this.articleModel.find().populate('ownerId', 'username').exec();
  }


  async getArticleWithComments(articleFilterQuery: FilterQuery<Article>): Promise<Article> {
    const [article] = await this.articleModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'article',
          as: 'comments',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner',
        },
      },
      {
        $unwind: "$owner"
      },
      {
        "$project": {
          "_id": 1,
          "title": 1,
          "content": 1,
          "photoUrl": 1,
          "owner._id": 1,
          "owner.username": 1,
          "comments": 1
        }
      }
    ])
    console.log(article)
    return article;
  }

  findOne(articleFilterQuery: FilterQuery<Article>): Promise<Article> {
    return this.articleModel
      .findOne(articleFilterQuery)
      .populate('ownerId', 'username')
      .populate({
        path: 'comments',
        model: 'Comment',
        strictPopulate: false
      })
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
