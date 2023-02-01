import { Controller, Get, Post } from "@nestjs/common";

@Controller('posts')
export class PostController {

    @Get()
    findAll(): string {
        return 'test string'
    }

    @Post
}