import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { FollowModule } from 'src/follow/follow.module';
import { UsersModule } from 'src/users/users.module';
import { StoriesController } from './stories.controller';
import { StoriesMapper } from './stories.mapper';
import { StoriesRepository } from './stories.repository';
import { StoriesService } from './stories.service';
import { Story, StorySchema } from './story.schema';

@Module({
  imports: [
    NestjsFormDataModule,
    CloudinaryModule,
    forwardRef(() => UsersModule),
    forwardRef(() => FollowModule),
    MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
  ],
  controllers: [StoriesController],
  providers: [StoriesService, StoriesRepository, StoriesMapper],
  exports: [StoriesService, StoriesRepository, StoriesMapper],
})
export class StoryModule {}
