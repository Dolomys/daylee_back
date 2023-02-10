import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Categories } from './category.enum';

@Injectable()
export class ValidateCategoryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // No query made
    if (!value) return;

    if (!Object.values(Categories).includes(value)) throw new BadRequestException('Wrong Category Query');

    return value;
  }
}
