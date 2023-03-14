import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { FollowController } from './follow.controller';
import { FollowRepository } from './follow.repository';
import { Follow, FollowSchema } from './follow.schema';
import { FollowService } from './follow.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]), forwardRef(()=> UsersModule)],
  providers: [FollowService, FollowRepository],
  exports: [FollowService, FollowRepository],
  controllers: [FollowController],
})
export class FollowModule {}
