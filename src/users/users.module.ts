import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMapper } from './user.mapper';
import { User, UserSchema } from './user.schema';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, UsersRepository, UserMapper],
  exports: [UsersService, UsersRepository, UserMapper],
})
export class UsersModule {}
