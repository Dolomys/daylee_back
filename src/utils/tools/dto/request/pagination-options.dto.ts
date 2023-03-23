import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional } from 'class-validator';

const PaginationTakeStep = [5, 10, 25, 50, 100, 200, 500, 1000];

export class PaginationOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ enum: PaginationTakeStep, default: 25 })
  @IsInt()
  @IsOptional()
  @IsEnum(PaginationTakeStep)
  limit?: number;
}
