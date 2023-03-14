import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CommentService } from './comments.service';

@Injectable()
export class CommentByIdPipe implements PipeTransform {
  constructor(private readonly commentService: CommentService) {}

  transform(value: any, metadata: ArgumentMetadata) {
    return this.commentService.getCommentById(value);
  }
}
