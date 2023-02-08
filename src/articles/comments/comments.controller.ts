import {
  Controller
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comments.service';

@ApiTags('Comments')
@Controller('/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

}
