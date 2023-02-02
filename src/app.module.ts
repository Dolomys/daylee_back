import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleController } from './articles/articles.controller';
import { ArticleModule } from './articles/articles.module';
import { ArticleService } from './articles/articles.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://Dolomys:Dolomys@cluster0.gwsvg.mongodb.net/myFirstDatabase',
    ),
    ArticleModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
