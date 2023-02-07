import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from '../articles.module';
import { Comment, CommentSchema } from './comment.schema';
import { CommentsController } from './comments.controller';
import { CommentRepository } from './comments.repository';
import { CommentService } from './comments.service';


@Module({
  imports: [
    ArticleModule,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [CommentsController],
  providers: [CommentService, CommentRepository],
  exports: [CommentService, CommentRepository],
})

export class CommentsModule {}
