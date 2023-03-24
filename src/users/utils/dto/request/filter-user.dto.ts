import { ApiPropertyOptional, IntersectionType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PaginationOptionsDto } from "src/utils/tools/dto/request/pagination-options.dto";

export class FilterUserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    query?: string
}

export class FilterAndPaginateDto extends IntersectionType(
    FilterUserDto,
    PaginationOptionsDto,
  ) {}