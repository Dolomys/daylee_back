import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { PaginationOptionsDto } from 'src/utils/tools/dto/request/pagination-options.dto';
import { Article } from '../article.schema';
import { Comment, CommentDocument } from './comment.schema';

const PAGINATE_QUERY_LIMIT = 10;

@Injectable()
export class CommentRepository {
  constructor(@InjectModel(Comment.name) private commentModel: mongoose.PaginateModel<CommentDocument>) {}

  async orThrow<T>(x: T | null) {
    if (x == null) throw new NotFoundException('Comment not found');
    return x;
  }

  addComment = (comment: any) => this.commentModel.create(comment);

  findCommentById = (commentId: string) =>
    this.commentModel.findOne({ _id: commentId }).populate('owner').exec().then(this.orThrow);

  async findCommentsByArticle(article: Article, paginationOptionsDto: PaginationOptionsDto) {
    const options = {
      page: paginationOptionsDto.page ?? 1,
      limit: PAGINATE_QUERY_LIMIT,
      populate: 'owner',
    };
    return await this.commentModel.paginate({ article: article }, options);
  }

  countCommentsByArticle = (article: Article) => this.commentModel.find({ article: article }).count().exec();

  findCommentsResponse = (comment: Comment) =>
    this.commentModel.find({ parentComment: comment }).populate('owner').exec();

  findCommentsByOwner = (owner: UserDocument) => this.commentModel.find({ owner: owner }).populate('article').exec();
}
