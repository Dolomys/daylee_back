import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './articles/articles.module';
import { CommentsModule } from './articles/comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: './env/.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URL ?? ''),
    ArticleModule,
    CommentsModule,
    AuthModule,
    UsersModule,
    CloudinaryModule,
  ],
})
export class AppModule {}
