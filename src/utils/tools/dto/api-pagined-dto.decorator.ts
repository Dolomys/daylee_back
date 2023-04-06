import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationDto } from './response/get-items-paginated.dto';

export const ApiPaginatedDto = <TModel extends Type, YModel extends Type>(model: TModel, description?: string) =>
  applyDecorators(
    ApiExtraModels(PaginationDto, model),
    ApiOkResponse({
      description: description ?? 'SUCCESS',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationDto) },
          { properties: { data: { type: 'array', items: { $ref: getSchemaPath(model) } } } },
        ],
      },
    }),
  );
