import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { FilterQuery, Model } from 'mongoose';
import { NewCommentary } from './dto/new-commentary.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const newArticle = new this.articleModel(createArticleDto);
    return newArticle.save();
  }

  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  async findOne(articleFilterQuery: FilterQuery<Article>): Promise<Article> {
    return this.articleModel
      .findOne(articleFilterQuery)
      .populate('comments')
      .exec();
  }

  async update(
    articleFilterQuery: FilterQuery<Article>,
    article: Partial<Article>,
  ): Promise<Article> {
    return this.articleModel
      .findOneAndUpdate(articleFilterQuery, article, { new: true })
      .exec();
  }

  async delete(articleFilterQuery: FilterQuery<Article>): Promise<Article> {
    return this.articleModel.findOneAndRemove(articleFilterQuery).exec();
  }

  async addComment(
    articleFilterQuery: FilterQuery<Article>,
    comments: NewCommentary,
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
