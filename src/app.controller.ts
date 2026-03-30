import { Controller, Get, HttpCode, Req, Res } from '@nestjs/common';
// import { AppService } from './app.service';
import express from 'express';

@Controller()
export class AppController {
  //   constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get('/')
  index(@Req() request: express.Request, @Res() response: express.Response) {
    console.log(request.url);
    response.status(200).json({
      message: 'Hello World',
    });
  }

  //manejo de status code http
  @Get('new')
  @HttpCode(201)
  somethingNew() {
    return 'Something new';
  }

  @Get('notfound')
  @HttpCode(404)
  notFoundPage() {
    return '404 not found';
  }

  @Get('error')
  @HttpCode(500)
  errorPage() {
    return 'Error Route!!';
  }
}
