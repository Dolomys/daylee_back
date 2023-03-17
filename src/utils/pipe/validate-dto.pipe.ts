import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private readonly DtoClass: any) {}

  async transform(value: unknown) {
    const dto = plainToClass(this.DtoClass, value as object);
    const errors = await validate(dto as Record<string, any>);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return dto;
  }
}