import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class GetAllArticlesDto {
  @ApiProperty()
  @IsArray()
  articles: any[];
}
