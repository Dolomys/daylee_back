import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Protect } from 'src/utils/decorator/auth.decorator';
import { ApiPaginatedDto } from 'src/utils/tools/dto/api-pagined-dto.decorator';
import { PaginationOptionsDto } from 'src/utils/tools/dto/request/pagination-options.dto';
import { ArticleDocument } from '../article.schema';
import { ArticleByIdPipe } from '../utils/article.pipe';
import { CommentService } from './comments.service';
import { GetCommentaryDto } from './dto/response/get-commentary.dto';

@ApiTags('Comments')
@Controller('/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

  @Protect()
  @Get(':articleId')
  @ApiOperation({ description: 'Get comments paginated from article ID' })
  @ApiParam({ name: 'articleId', type: String })
  @ApiPaginatedDto(GetCommentaryDto)
  getArticleCommentsPaginated(
    @Param('articleId', ArticleByIdPipe) article: ArticleDocument,
    @Query() paginationOptionDto: PaginationOptionsDto,
  ) {
    return this.commentService.getArticleComments(article, paginationOptionDto);
  }
}
