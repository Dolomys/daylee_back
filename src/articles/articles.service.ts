
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { Model } from 'mongoose';
import { UpdateArticleDto } from './dto/update-article.dto';
import { NewCommentary } from './dto/new-commentary.dto';


@Injectable()
export class ArticleService {
  constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const createdArticle = new this.articleModel(createArticleDto);
    return createdArticle.save();
  }

  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  async findOne(id:string): Promise<Article> {
      return this.articleModel.findById(id).exec()
  }

  async update(id:string, UpdateArticleDto: UpdateArticleDto):Promise<Article> {
    try{
      const articleToUpdate = this.articleModel.findByIdAndUpdate(id,UpdateArticleDto,{new: true}).exec()
      return articleToUpdate
    }
    catch(err){
      return err
    }
  }

  async delete(id:string):Promise<Article>{
    return this.articleModel.findByIdAndRemove(id).exec()
  }

  async addComment(id:string, comments:NewCommentary):Promise<Article> {
    const updatePost = await this.articleModel.findByIdAndUpdate(id,{
      $push:{comments:comments}
    },{new:true})
    return updatePost
  }
}