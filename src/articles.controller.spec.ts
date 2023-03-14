import { forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { ArticleMapper } from './articles/article.mapper';
import { Article, ArticleSchema } from './articles/article.schema';
import { ArticleController } from './articles/articles.controller';
import { ArticleRepository } from './articles/articles.repository';
import { ArticleService } from './articles/articles.service';
import { CommentSchema } from './articles/comments/comment.schema';
import { CommentsModule } from './articles/comments/comments.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UsersModule } from './users/users.module';

describe('CatsController', () => {
  let articleService: ArticleService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        CloudinaryModule,
        forwardRef(() => CommentsModule),
        forwardRef(() => UsersModule),
        MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
      ],
      controllers: [ArticleController],
      providers: [ArticleService, ArticleRepository, ArticleMapper],
      exports: [ArticleService, ArticleRepository, ArticleMapper],
      }).compile();

      articleService = moduleRef.get<ArticleService>(ArticleService);
  });

  describe('getArticles', () => {
    it('should return an array of articles', async () => {
    let result;
    jest.spyOn(articleService, 'getArticlesNoFilter').mockImplementation(() => result);
    expect(await articleService.getArticles()).toBe(result);
    });
  });
});