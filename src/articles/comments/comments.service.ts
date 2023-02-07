import { Injectable } from '@nestjs/common';
import { Article } from '../article.schema';
import { Comment } from './comment.schema';
import { CommentRepository } from './comments.repository';
import { CreateCommentaryDto } from './dto/request/create-commentary.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async addComment(userId: string, createCommentaryDto: CreateCommentaryDto, article: Article) {
    const newComment: Comment = {
      ...createCommentaryDto,
      ownerId: userId,
      article: article
    }
    return this.commentRepository.addComment(newComment);
  }

  getArticleComments(article: Article){
    console.log('hi')
    return this.commentRepository.findComments({article: article})
  }
}
