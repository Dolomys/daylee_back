import { ApiProperty } from '@nestjs/swagger';
import { GetArticleLightDto } from 'src/articles/dto/response/get-article-light.dto';
import { GetUserDtoLight } from 'src/users/utils/dto/response/get-user-light.dto';
import { NotificationTypeEnum } from '../../notification-type.enum';

export class GetNotificationDto {
  @ApiProperty({ enum: NotificationTypeEnum })
  notificationType: NotificationTypeEnum;

  @ApiProperty({ type: GetArticleLightDto })
  article: GetArticleLightDto;

  @ApiProperty({ type: GetUserDtoLight })
  receiver: GetUserDtoLight;

  @ApiProperty({ type: GetUserDtoLight })
  sender: GetUserDtoLight;

  @ApiProperty({ type: Boolean })
  hasSeen: boolean;
}
