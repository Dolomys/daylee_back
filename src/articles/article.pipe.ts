import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ArticleRepository } from './article.repository';
import { ArticleService } from './articles.service';
import { Article } from './schemas/article.schema';

@Injectable()
export class ArticleByIdPipe implements PipeTransform {
  constructor(private readonly articleService: ArticleService) {}

  transform(value: any, metadata: ArgumentMetadata) {
    return this.articleService.getArticleById(value);
  }
}
