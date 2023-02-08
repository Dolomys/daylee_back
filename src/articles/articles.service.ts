import { Injectable } from '@nestjs/common';
import { ArticleMapper } from './article.mapper';
import { Article } from './article.schema';
import { ArticleRepository } from './articles.repository';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { UpdateArticleDto } from './dto/request/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository, private readonly articleMapper:ArticleMapper) {}

 async getArticleById(articleId: string) {
  return this.articleRepository.getArticleWithComments({ _id: articleId })
    // const result = await this.articleRepository.findOne({ _id: articleId });
    // if (!result)
    //   throw new NotFoundException(`this article doesn't exist`);
    
    // return this.articleMapper.toGetArticleDto(result)
  }

  getArticles() {
    return this.articleRepository.findAll().then((articleList) => articleList.map(article => this.articleMapper.toGetArticleDto(article)))
  }

  async createArticle(createArticleDto: CreateArticleDto, userId:string){
    const newArticle: Article = {
      ...createArticleDto,
      ownerId: userId
    }
    const articleCreated = await this.articleRepository.create(newArticle);
    console.log(articleCreated)
    return this.articleMapper.toGetArticleDto(articleCreated)
  }

  async updateArticle(
    articleToUpdate: Article,
    updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleRepository
      .update(articleToUpdate, updateArticleDto)
      .then((updatedArticle)=> this.articleMapper.toGetArticleDto(updatedArticle))
  }

  deleteArticle(articleId: string) {
    return this.articleRepository.delete({ _id: articleId });
  }
}
