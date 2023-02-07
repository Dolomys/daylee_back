import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ArticleService } from './articles.service';

@Injectable()
export class ArticleByIdPipe implements PipeTransform {
  constructor(private readonly articleService: ArticleService) {}

  transform(value: any, metadata: ArgumentMetadata) {
    return this.articleService.getArticleById(value);
  }
}
