import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("cats")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

    // Si deux routes avec le meme decorateur , il n'execute que le premier
  @Get(':test')
  findOneSimple(@Param('test') test:string ): string {
    return `this is a simplier version with ${test}`
  }

  @Get(':test')
  findOne(@Param() params): string {
  console.log(params);
  return `This action returns a #${params.test} cat`;
}

}
