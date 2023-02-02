import { Controller, Get, Post, Body, Param, Put, Delete } from "@nestjs/common";
import { Article } from "./schemas/article.schema";
import { ArticleService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { HttpException } from "@nestjs/common/exceptions";
import { HttpStatus } from "@nestjs/common/enums";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { NewCommentary } from "./dto/new-commentary.dto";

@Controller('articles')
export class ArticleController {

    constructor(private articleService : ArticleService) {}

    @Get()
    async findAll(){
         return this.articleService.findAll()
    }
   
    @Post()
    async create(@Body() createArticleDto: CreateArticleDto) {
        this.articleService.create(createArticleDto);
      }

    @Get(':id')
    async getOne(@Param('id') id: string){
        const result = await this.articleService.findOne(id)

        // No error thrown by mongoose if id incorrect, could not try catch
        if(result)
            return result
        else
            throw new HttpException('No Article with this id', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Put(':id')
    async update(
        @Param('id') id:string,
        @Body() updateArticleDto: UpdateArticleDto){
        return this.articleService.update(id,updateArticleDto)
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.articleService.delete(id)
    }

    @Put('/comment/:id')
    async addComment(
        @Param('id') id: string,
        @Body() newCommentary: NewCommentary) {
        return this.articleService.addComment(id, newCommentary)
    }


}