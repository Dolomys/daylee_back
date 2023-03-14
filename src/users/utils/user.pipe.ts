import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { UsersRepository } from '../users.repository';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(private readonly userRepository: UsersRepository) {}

  transform(value: any, metadata: ArgumentMetadata) {
    return this.userRepository.findOneById(value);
  }
}
