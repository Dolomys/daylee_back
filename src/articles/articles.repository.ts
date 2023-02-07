import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Article, ArticleDocument } from './article.schema';
import { Comment, CommentDocument } from './comments/comment.schema';
import { CreateCommentaryDto } from './comments/dto/request/create-commentary.dto';

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

  findOne(articleFilterQuery: FilterQuery<Article>): Promise<Article> {
    return this.articleModel
      .findOne(articleFilterQuery)
      .populate('ownerId')
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

  addComment(
    articleFilterQuery: FilterQuery<Article>,
    comments: CreateCommentaryDto,
  ): Promise<Article> {
    const newComment = new this.commentModel(comments);
    newComment.save();
    return this.articleModel
      .findOneAndUpdate(
        articleFilterQuery,
        {
          $push: { comments: newComment },
        },
        { new: true },
      )
      .populate('comments')
      .exec();
  }
}
