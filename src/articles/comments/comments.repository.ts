import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { Article } from '../article.schema';
import { Comment, CommentDocument } from './comment.schema';

@Injectable()
export class CommentRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async orThrow<T>(x: T | null) {
    if (x == null) throw new NotFoundException('Comment not found');
    return x;
  }

  addComment(comments: Comment): Promise<CommentDocument> {
    return this.commentModel.create(comments);
  }

  findCommentById(commentId: string): Promise<CommentDocument> {
    return this.commentModel.findOne({ _id: commentId }).populate('owner').exec().then(this.orThrow);
  }

  findCommentsByArticle(article: Article): Promise<CommentDocument[]> {
    return this.commentModel.find({ article: article }).populate('owner').exec();
  }

  countCommentsByArticle = (article: Article) => this.commentModel.find({ article: article}).count().exec()

  findCommentsResponse(comment: Comment): Promise<CommentDocument[]> {
    return this.commentModel.find({ parentComment: comment }).populate('owner').exec();
  }

  findCommentsByOwner(owner: UserDocument): Promise<CommentDocument[]> {
    return this.commentModel.find({ owner: owner }).populate('article').exec();
  }
}
