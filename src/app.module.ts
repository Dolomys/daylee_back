import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import cloudinaryConfig from 'env/cloudinary.config';
import { ArticleModule } from './articles/articles.module';
import { CommentsModule } from './articles/comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FollowModule } from './follow/follow.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './env/.env',
      load: [cloudinaryConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: config.get('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
    ArticleModule,
    CommentsModule,
    AuthModule,
    UsersModule,
    CloudinaryModule,
    FollowModule,
    ChatModule
  ],
})
export class AppModule {}
