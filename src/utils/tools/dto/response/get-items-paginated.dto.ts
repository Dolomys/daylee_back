import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Document, PaginateResult } from 'mongoose';

export class PaginationMetaDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  pageCount: number;

  @ApiProperty()
  hasPreviousPage: boolean;

  @ApiProperty()
  hasNextPage: boolean;
}

export class PaginationDto<T> {
  @ApiProperty({ isArray: true })
  @IsArray()
  data: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto = new PaginationMetaDto();

  constructor(data: (T extends Promise<T> ? never : T)[], queryMeta: PaginateResult<Document>) {
    this.data = data;
    this.meta.page = queryMeta.page ?? 0;
    this.meta.take = queryMeta.limit;
    this.meta.itemCount = queryMeta.totalDocs;
    this.meta.pageCount = queryMeta.pagingCounter;
    this.meta.hasPreviousPage = queryMeta.hasPrevPage;
    this.meta.hasNextPage = queryMeta.hasNextPage;
  }
}
