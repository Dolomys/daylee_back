import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
export class PaginationOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  page?: number;
}
