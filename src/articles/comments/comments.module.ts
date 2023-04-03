import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';
import { ArticleModule } from '../articles.module';
import { CommentMapper } from './comment.mapper';
import { Comment, CommentSchema } from './comment.schema';
import { CommentsController } from './comments.controller';
import { CommentRepository } from './comments.repository';
import { CommentService } from './comments.service';

@Module({
  imports: [
    forwardRef(() => ArticleModule),
    forwardRef(() => UsersModule),
    NotificationsModule,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [CommentsController],
  providers: [CommentService, CommentRepository, CommentMapper],
  exports: [CommentService, CommentRepository, CommentMapper],
})
export class CommentsModule {}
