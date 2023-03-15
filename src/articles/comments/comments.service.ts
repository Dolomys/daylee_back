import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/users/user.schema';
import { Article, ArticleDocument } from '../article.schema';
import { CommentMapper } from './comment.mapper';
import { Comment, CommentDocument } from './comment.schema';
import { CommentRepository } from './comments.repository';
import { CreateCommentaryDto } from './dto/request/create-commentary.dto';
import { GetCommentaryDto } from './dto/response/get-commentary.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository, private readonly commentMapper: CommentMapper) {}

  async addComment(
    user: UserDocument,
    createCommentaryDto: CreateCommentaryDto,
    article: ArticleDocument,
    parentComment?: CommentDocument,
  ) {
    const newComment: Comment = {
      ...createCommentaryDto,
      parentComment: parentComment,
      owner: user,
      article: article,
    };
    const result = await this.commentRepository.addComment(newComment);
    return this.commentMapper.toGetCommentDto(result);
  }

  getArticleComments(article: Article): Promise<GetCommentaryDto[]> {
    return this.commentRepository
      .findCommentsByArticle(article)
      .then((commentList) => commentList.map((comment) => this.commentMapper.toGetCommentDto(comment)));
  }

  getCommentResponses(comment: Comment): Promise<GetCommentaryDto[]> {
    return this.commentRepository
      .findCommentsResponse(comment)
      .then((commentList) => commentList.map((comment) => this.commentMapper.toGetCommentDto(comment)));
  }

  getCommentById(commentId: string): Promise<CommentDocument> {
    return this.commentRepository.findCommentById(commentId);
  }
}
