import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ValidationOptions } from 'class-validator/types/decorator/ValidationOptions';

export function ValidateN(f: Function, validationOptions?: ValidationOptions) {
  return applyDecorators(
    IsNotEmpty(),
    ValidateNested(validationOptions),
    Type(() => f),
  );
}
