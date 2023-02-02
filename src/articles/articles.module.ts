import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleController } from './articles.controller';
import { ArticleService } from './articles.service';
import { Article, ArticleSchema } from './schemas/article.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Article.name , schema: ArticleSchema }])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}