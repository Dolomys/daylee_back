import { Injectable } from '@nestjs/common';
import { GetCommentaryDto } from './dto/response/get-commentary.dto';

@Injectable()
export class CommentMapper {
  toGetCommentDto = (comment: any): GetCommentaryDto => ({
    id: comment.id,
    content: comment.content,
    owner: comment.owner,
  });
}
