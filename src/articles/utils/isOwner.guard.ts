import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ArticleService } from '../articles.service';

@Injectable()
export class ArticleOwnerGuard implements CanActivate {
    constructor(private readonly articleService: ArticleService){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user
    const articleId = request.params.articleId;
    return this.articleService.isOwner(user, articleId)
  }
}
