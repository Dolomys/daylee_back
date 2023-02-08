import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';
import { ArticleByIdPipe } from '../article.pipe';
import { Article } from '../article.schema';
import { CommentService } from './comments.service';
import { CreateCommentaryDto } from './dto/request/create-commentary.dto';

@ApiTags('Comments')
@Controller('/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async addComment(
    @Param('id', ArticleByIdPipe) article: Article,
    @Body() createCommentaryDto: CreateCommentaryDto,
    @Request() req,
  ) {
    return this.commentService.addComment(
      req.user._id,
      createCommentaryDto,
      article,
    );
  }
}
