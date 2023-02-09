import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserDocument } from 'src/users/user.schema';
import { ArticleMapper } from './article.mapper';
import { Article, ArticleDocument } from './article.schema';
import { ArticleRepository } from './articles.repository';
import { CommentService } from './comments/comments.service';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { UpdateArticleDto } from './dto/request/update-article.dto';
import { GetArticleDto } from './dto/response/get-article.dto';
import { Categories } from './utils/category.enum';

@Injectable()
export class ArticleService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly articleRepository: ArticleRepository,
    private readonly articleMapper: ArticleMapper,
    @Inject(forwardRef(() => CommentService))
    private commentService: CommentService,
  ) {}

  async isOwner(user: UserDocument, articleId: string): Promise<boolean> {
    const article = await this.getArticleById(articleId);
    return article.owner.id === user.id;
  }

  async getArticleWithComments(article: ArticleDocument): Promise<GetArticleDto> {
    const comments = await this.commentService.getArticleComments(article);
    return this.articleMapper.toGetArticleDto(article, comments);
  }

  getArticleById(articleId: string): Promise<ArticleDocument> {
    return this.articleRepository.findOneById(articleId);
  }

  getArticlesNoFilter() {
    return this.articleRepository
      .findAll()
      .then((articleList) => articleList.map((article) => this.articleMapper.toGetArticleLightDto(article)));
  }

  getArticles(category?: Categories){
    if(category)
      return this.articleRepository
      .findAll({category: category})
      .then((articleList) => articleList.map((article) => this.articleMapper.toGetArticleLightDto(article)));
    else
    return this.getArticlesNoFilter()
  }

  async createArticle(createArticleDto: CreateArticleDto, user: UserDocument) {
    const newArticle: Article = {
      ...createArticleDto,
      owner: user,
    };

    const articleCreated = await this.articleRepository.create(newArticle);
    return this.articleMapper.toGetArticleDto(articleCreated);
  }

  async updateArticle(articleToUpdate: ArticleDocument, updateArticleDto: UpdateArticleDto) {
    return this.articleRepository
      .update(articleToUpdate, updateArticleDto)
      .then((updatedArticle) => this.getArticleWithComments(updatedArticle));
  }

  deleteArticle(articleId: string) {
    return this.articleRepository.delete({ _id: articleId });
  }
}
