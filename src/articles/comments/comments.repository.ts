import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { Article } from '../article.schema';
import { Comment, CommentDocument } from './comment.schema';

@Injectable()
export class CommentRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  addComment(comments: Comment): Promise<CommentDocument> {
    return this.commentModel.create(comments);
  }

  findCommentsByArticle(article: Article): Promise<CommentDocument[]> {
    return this.commentModel.find({article: article}).populate('owner').exec();
  }

  findCommentsByOwner(owner: UserDocument):Promise<CommentDocument[]> {
    return this.commentModel.find({owner: owner}).populate('article').exec()
  }
  
}
