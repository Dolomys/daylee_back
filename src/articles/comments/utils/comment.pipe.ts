import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CommentRepository } from '../comments.repository';

@Injectable()
export class CommentByIdPipe implements PipeTransform {
  constructor(private readonly commentRepository: CommentRepository) {}

  transform(value: any, metadata: ArgumentMetadata) {
    return this.commentRepository.findCommentById(value);
  }
}
