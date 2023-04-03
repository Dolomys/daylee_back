import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserDocument } from 'src/users/user.schema';
import { Protect } from 'src/utils/decorator/auth.decorator';
import { ConnectedUser } from 'src/utils/decorator/customAuth.decorator';
import { NotificationDocument } from './notification.schema';
import { NotificationsService } from './notifications.service';
import { GetNotificationDto } from './utils/dto/response/get-notification.dto';
import { NotificationByIdPipe } from './utils/notification.pipe';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Protect()
  @Get()
  @ApiOperation({ summary: 'Get Connected user notifications' })
  @ApiOkResponse({ description: 'SUCCESS', type: [GetNotificationDto] })
  getConnectedUserNotifications(@ConnectedUser() user: UserDocument) {
    this.notificationsService.getAllNotificationByUser(user);
  }

  @Protect()
  @Post(':notificationId/seen')
  @ApiParam({ name: 'notificationId', type: String })
  @ApiOperation({ summary: 'Update Notification to seen' })
  @ApiOkResponse({ description: 'SUCCESS', type: GetNotificationDto })
  updateNotificationSeen(
    @Param('notificationId', NotificationByIdPipe) notification: NotificationDocument,
    @ConnectedUser() user: UserDocument,
  ) {
    this.notificationsService.updateNotificationSeen(notification, user);
  }
}
