import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserDocument } from 'src/users/user.schema';
import { ArticleMapper } from './article.mapper';
import { Article, ArticleDocument } from './article.schema';
import { ArticleRepository } from './articles.repository';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { UpdateArticleDto } from './dto/request/update-article.dto';
import { GetArticleDto } from './dto/response/get-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly articleRepository: ArticleRepository,
    private readonly articleMapper: ArticleMapper,
  ) {}

  async isOwner(user: UserDocument, articleId: string): Promise<boolean> {
    const article = await this.getArticleById(articleId);
    return article.owner.id === user.id;
  }

  getArticleWithComments = (article: ArticleDocument): Promise<GetArticleDto> =>
    this.articleMapper.toGetArticleDto(article);

  getArticleById = (articleId: string): Promise<ArticleDocument> => this.articleRepository.findOneById(articleId);

  getArticles = () =>
    this.articleRepository
      .findAll()
      .then((articleList) => articleList.map((article) => this.articleMapper.toGetArticleLightDto(article)));

  async createArticle(createArticleDto: CreateArticleDto, user: UserDocument) {
    const responseUpload = await this.cloudinaryService.uploadImage(createArticleDto.image);
    const photoUrl = responseUpload.url;
    console.log(photoUrl);
    const newArticle: Article = {
      ...createArticleDto,
      photoUrl: photoUrl,
      owner: user,
    };

    const articleCreated = await this.articleRepository.create(newArticle);
    return this.articleMapper.toGetArticleDto(articleCreated);
  }

  updateArticle = (articleToUpdate: ArticleDocument, updateArticleDto: UpdateArticleDto) =>
    this.articleRepository
      .update(articleToUpdate, updateArticleDto)
      .then((updatedArticle) => this.getArticleWithComments(updatedArticle));

  deleteArticle = (articleId: string) => this.articleRepository.delete({ _id: articleId });

  addLikeToArticle(article: ArticleDocument, user: UserDocument) {
    if (article.likes?.includes(user._id))
      return this.articleRepository
        .removeLike(article, user)
        .then((updatedArticle) => this.articleMapper.toGetArticleLightDto(updatedArticle));
    else
      return this.articleRepository
        .addLike(article, user)
        .then((updatedArticle) => this.articleMapper.toGetArticleLightDto(updatedArticle));
  }
}
