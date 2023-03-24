import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FollowRepository } from 'src/follow/follow.repository';
import { UserDocument } from 'src/users/user.schema';
import { PaginationOptionsDto } from 'src/utils/tools/dto/request/pagination-options.dto';
import { PaginationDto } from 'src/utils/tools/dto/response/get-items-paginated.dto';
import { ArticleMapper } from './article.mapper';
import { ArticleDocument } from './article.schema';
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
    private readonly followRepository: FollowRepository,
  ) {}

  async isOwner(user: UserDocument, articleId: string): Promise<boolean> {
    const article = await this.getArticleById(articleId);
    return article.owner.id === user.id;
  }

  getArticleWithComments = (article: ArticleDocument): Promise<GetArticleDto> =>
    this.articleMapper.toGetArticleDto(article);

  getArticleById = (articleId: string): Promise<ArticleDocument> => this.articleRepository.findOneById(articleId);

  async getArticles(paginationOptionsDto: PaginationOptionsDto) {
    const articles = await this.articleRepository.findAllWithPaginate(paginationOptionsDto);
    return new PaginationDto(await this.articleMapper.toGetArticleListLightDto(articles.docs), articles);
  }

  async getFeed(user: UserDocument, paginationOptionsDto: PaginationOptionsDto) {
    const followingUsers = await this.followRepository.getUserFollowingsByIdOrThrow(user.id);
    const formatedArray = followingUsers.map((item) => item.following);
    const articles = await this.articleRepository.findArticleFeedPaginate(formatedArray, paginationOptionsDto);
    return new PaginationDto(await this.articleMapper.toGetArticleListLightDto(articles.docs), articles);
  }

  async getPersonalFeed(user: UserDocument, paginationOptionsDto: PaginationOptionsDto) {
    const articles = await this.articleRepository.findArticleFeedPaginate(user, paginationOptionsDto);
    return new PaginationDto(await this.articleMapper.toGetArticleListLightDto(articles.docs), articles);
  }

  async createArticle(createArticleDto: CreateArticleDto, user: UserDocument) {
    const photoUrl = await this.cloudinaryService.uploadFileAndGetUrl(createArticleDto.image);
    const newArticle = {
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
