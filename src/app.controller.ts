import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/login")
  login(@Res() res: Response) {
    return res.render('login', { layout: 'login' });
  }
  @Get()
  root(@Res() res: Response) {
    return res.render('index', { layout: 'main' });
  }

}
