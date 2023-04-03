import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NotificationsService } from 'src/notifications/notifications.service';
import { createNotificationInterface } from 'src/notifications/utils/create-notification.interface';
import { NotificationTypeEnum } from 'src/notifications/utils/notification-type.enum';
import { UserDocument } from 'src/users/user.schema';
import { PaginationOptionsDto } from 'src/utils/tools/dto/request/pagination-options.dto';
import { PaginationDto } from 'src/utils/tools/dto/response/get-items-paginated.dto';
import { Article, ArticleDocument } from '../article.schema';
import { ArticleRepository } from '../articles.repository';
import { CommentMapper } from './comment.mapper';
import { Comment, CommentDocument } from './comment.schema';
import { CommentRepository } from './comments.repository';
import { CreateCommentaryDto } from './dto/request/create-commentary.dto';
import { GetCommentaryDto } from './dto/response/get-commentary.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly commentMapper: CommentMapper,
    private readonly articleRepository: ArticleRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async addComment(user: UserDocument, createCommentaryDto: CreateCommentaryDto, article: ArticleDocument) {
    const newComment = {
      ...createCommentaryDto,
      owner: user,
      article: article,
    };
    const result = await this.commentRepository.addComment(newComment);
    await this.articleRepository.updateCommentsCount(article, 1);
    const notification: createNotificationInterface = {
      notificationType: NotificationTypeEnum.COMMENT,
      article: article,
      sender: user,
    };
    await this.notificationsService.createNotification(notification);
    return this.commentMapper.toGetCommentDto(result);
  }

  async getArticleComments(article: Article, paginationOptionsDto: PaginationOptionsDto) {
    const commentsPaginated = await this.commentRepository.findCommentsByArticle(article, paginationOptionsDto);
    return new PaginationDto(await this.commentMapper.toGetCommentsListDto(commentsPaginated.docs), commentsPaginated);
  }

  getCommentResponses = (comment: Comment): Promise<GetCommentaryDto[]> =>
    this.commentRepository
      .findCommentsResponse(comment)
      .then((commentList) => commentList.map((comment) => this.commentMapper.toGetCommentDto(comment)));

  async removeComment(user: UserDocument, comment: CommentDocument) {
    const isOwner = comment.owner == user;
    if (!isOwner) throw new UnauthorizedException('NOT_OWNER');
    await this.articleRepository.updateCommentsCount(comment.article, -1);
    return await this.commentRepository.deleteComment(comment);
  }
}
