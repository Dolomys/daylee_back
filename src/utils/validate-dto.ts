import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateAndTransform<T extends Record<string, unknown>>(
  dtoClass: new () => T,
  payload: T,
): Promise<T> {
  const dto = plainToClass(dtoClass, payload);
  const errors = await validate(dto);
  if (errors.length > 0) {
    throw new BadRequestException('Validation failed');
  }
  return dto;
}
