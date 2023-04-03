import { Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FollowRepository } from 'src/follow/follow.repository';
import { LikesService } from 'src/likes/likes.service';
import { UserDocument } from 'src/users/user.schema';
import { PaginationOptionsDto } from 'src/utils/tools/dto/request/pagination-options.dto';
import { PaginationDto } from 'src/utils/tools/dto/response/get-items-paginated.dto';
import { ArticleDocumentHasLiked } from 'src/utils/types';
import { ArticleMapper } from './article.mapper';
import { ArticleDocument } from './article.schema';
import { ArticleRepository } from './articles.repository';
import { GetArticleDto } from './dto/response/get-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly articleRepository: ArticleRepository,
    private readonly articleMapper: ArticleMapper,
    private readonly followRepository: FollowRepository,
    private readonly likesService: LikesService,
  ) {}

  async isOwner(user: UserDocument, articleId: string): Promise<boolean> {
    const article = await this.getArticleById(articleId);
    return article.owner.id === user.id;
  }

  getArticleFull = (article: ArticleDocument): Promise<GetArticleDto> => this.articleMapper.toGetArticleDto(article);

  getArticleById = (articleId: string): Promise<ArticleDocument> => this.articleRepository.findOneById(articleId);

  async articlesWithHasLiked(
    articles: PaginateResult<ArticleDocument>,
    user: UserDocument,
  ): Promise<ArticleDocumentHasLiked[]> {
    return Promise.all(
      articles.docs.map(async (article) => {
        const hasLiked = await this.likesService.isLikedByUser(article, user.id);
        return {
          article,
          hasLiked,
        };
      }),
    );
  }

  async getArticles(paginationOptionsDto: PaginationOptionsDto, user: UserDocument) {
    const articles = await this.articleRepository.findAllWithPaginate(paginationOptionsDto);
    const articlesWithHasLiked = await this.articlesWithHasLiked(articles, user);
    return new PaginationDto(await this.articleMapper.toGetArticleListLightDto(articlesWithHasLiked), articles);
  }

  async getFeed(user: UserDocument, paginationOptionsDto: PaginationOptionsDto) {
    const followingUsers = await this.followRepository.getUserFollowingsByIdOrThrow(user.id);
    const formatedArray = followingUsers.map((item) => item.following);
    const articles = await this.articleRepository.findArticleFeedPaginate(formatedArray, paginationOptionsDto);
    const articlesWithHasLiked = await this.articlesWithHasLiked(articles, user);
    return new PaginationDto(await this.articleMapper.toGetArticleListLightDto(articlesWithHasLiked), articles);
  }

  async getUserFeed(user: UserDocument, paginationOptionsDto: PaginationOptionsDto) {
    const articles = await this.articleRepository.findArticleFeedPaginate(user, paginationOptionsDto);
    const articlesWithHasLiked = await this.articlesWithHasLiked(articles, user);
    return new PaginationDto(await this.articleMapper.toGetArticleListLightDto(articlesWithHasLiked), articles);
  }

  async createArticle(images: Express.Multer.File[], description: string, user: UserDocument) {
    const photoUrls = await this.cloudinaryService.uploadManyFilesAndGetUrl(images);
    const newArticle = {
      description: description,
      photoUrls: photoUrls,
      owner: user,
    };

    const articleCreated = await this.articleRepository.create(newArticle);
    return this.articleMapper.toGetArticleDto(articleCreated);
  }

  deleteArticle = (articleId: string) => this.articleRepository.delete({ _id: articleId });
}
