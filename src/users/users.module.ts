import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserMapper } from './user.mapper';
import { User, UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CloudinaryModule,
    NestjsFormDataModule,
  ],
  providers: [UsersService, UsersRepository, UserMapper],
  exports: [UsersService, UsersRepository, UserMapper],
  controllers: [UsersController],
})
export class UsersModule {}
