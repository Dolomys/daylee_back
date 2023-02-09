import { ApiProperty } from '@nestjs/swagger';
import { GetArticleLightDto } from './get-article.dto';

export class GetAllArticlesDto {
  @ApiProperty({ type: [GetArticleLightDto] })
  articles: GetArticleLightDto[];
}
