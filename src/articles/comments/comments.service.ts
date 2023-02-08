import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/users/user.schema';
import { ArticleDocument } from '../article.schema';
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
    user: UserDocument,
    createCommentaryDto: CreateCommentaryDto,
    article: ArticleDocument,
  ) {
    const newComment: Comment = {
      ...createCommentaryDto,
      owner: user,
      article: article,
    };
    const result = await this.commentRepository.addComment(newComment);
    return this.commentMapper.toGetCommentDto(result);
  }
}
