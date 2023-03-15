import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NestjsFormDataModule } from 'nestjs-form-data/dist/nestjs-form-data.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UsersModule } from 'src/users/users.module';
import { ArticleMapper } from './article.mapper';
import { Article, ArticleSchema } from './article.schema';
import { ArticleController } from './articles.controller';
import { ArticleRepository } from './articles.repository';
import { ArticleService } from './articles.service';
import { Comment, CommentSchema } from './comments/comment.schema';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    NestjsFormDataModule,
    CloudinaryModule,
    forwardRef(() => CommentsModule),
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository, ArticleMapper],
  exports: [ArticleService, ArticleRepository, ArticleMapper],
})
export class ArticleModule {}
