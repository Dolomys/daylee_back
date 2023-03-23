import { Injectable } from '@nestjs/common';
import { UserMapper } from 'src/users/user.mapper';
import { CommentDocument } from './comment.schema';
import { GetCommentaryDto } from './dto/response/get-commentary.dto';

@Injectable()
export class CommentMapper {
  constructor(private readonly userMapper: UserMapper) {}

  toGetCommentsListDto = (comments: CommentDocument[]): Promise<GetCommentaryDto[]> =>
    Promise.all(comments.map((x) => this.toGetCommentDto(x)));

  toGetCommentDto = (comment: CommentDocument): GetCommentaryDto => ({
    id: comment.id,
    content: comment.content,
    owner: this.userMapper.toGetUserDto(comment.owner),
    parentComment: comment.parentComment,
  });
}
