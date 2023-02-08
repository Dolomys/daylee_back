import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Article } from '../article.schema';
import { CommentMapper } from './comment.mapper';
import { Comment } from './comment.schema';
import { CommentRepository } from './comments.repository';
import { CreateCommentaryDto } from './dto/request/create-commentary.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly commentMapper: CommentMapper,
  ) {}

  async addComment(
    userId: Types.ObjectId,
    createCommentaryDto: CreateCommentaryDto,
    article: any,
  ) {
    console.log(article);
    const newComment: Comment = {
      ...createCommentaryDto,
      owner: userId,
      article: article.id,
    };
    const result = await this.commentRepository.addComment(newComment);
    return this.commentMapper.toGetCommentDto(result);
  }

  async getArticleComments(article: Article) {
    return this.commentRepository
      .findComments({ article: article })
      .then((commentList) =>
        commentList.map((comment) =>
          this.commentMapper.toGetCommentDto(comment),
        ),
      );
  }
}
