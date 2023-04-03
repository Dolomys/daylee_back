import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from 'src/articles/articles.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';
import { LikesController } from './likes.controller';
import { LikesRepository } from './likes.repository';
import { Like, LikesSchema } from './likes.schema';
import { LikesService } from './likes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikesSchema }]),
    NotificationsModule,
    forwardRef(()=> UsersModule),
    forwardRef(()=> ArticleModule),
  ],
  providers: [LikesService, LikesRepository],
  exports: [LikesService, LikesRepository],
  controllers: [LikesController],
})
export class LikesModule {}
