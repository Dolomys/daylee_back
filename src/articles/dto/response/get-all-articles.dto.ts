import { ApiProperty } from '@nestjs/swagger';
import { GetArticleLightDto } from './get-article-light.dto';


export class GetAllArticlesDto {
  @ApiProperty({ type: [GetArticleLightDto] })
  articles: GetArticleLightDto[];
}
