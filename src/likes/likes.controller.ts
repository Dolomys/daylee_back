import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ArticleDocument } from 'src/articles/article.schema';
import { GetArticleLightDto } from 'src/articles/dto/response/get-article-light.dto';
import { ArticleByIdPipe } from 'src/articles/utils/article.pipe';
import { UserDocument } from 'src/users/user.schema';
import { GetUserDtoLight } from 'src/users/utils/dto/response/get-user-light.dto';
import { Protect } from 'src/utils/decorator/auth.decorator';
import { ConnectedUser } from 'src/utils/decorator/customAuth.decorator';
import { LikesService } from './likes.service';

@ApiTags('Likes')
@Controller('Likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Protect()
  @Post(':articleId')
  @ApiParam({ name: 'articleId', type: String })
  @ApiOperation({ summary: 'Toggle Like on Article' })
  @ApiOkResponse({ description: 'SUCCESS', type: GetArticleLightDto })
  toggleLike(@Param('articleId', ArticleByIdPipe) article: ArticleDocument, @ConnectedUser() user: UserDocument) {
    return this.likesService.toggleLike(article, user);
  }

  @Protect()
  @Get(':articleId')
  @ApiParam({ name: 'articleId', type: String })
  @ApiOperation({ summary: 'Toggle Like on Article' })
  @ApiOkResponse({ description: 'SUCCESS', type: [GetUserDtoLight] })
  getLikeList(@Param('articleId', ArticleByIdPipe) article: ArticleDocument) {
    return this.likesService.getArticleLikesUsersList(article);
  }
}
