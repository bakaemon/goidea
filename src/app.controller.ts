import { Controller, Get, Render, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import Role from './common/enums/role.enum';
import RoleGuard from './common/guards/role.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("/login")
  login(@Res() res: Response) {
    return res.render('login', { layout: 'login' });
  }
  @Get()
  root(@Res() res: Response) {
    return res.render('main/index', { layout: 'home' });
  }

  @Get("/admin")
  // @UseGuards(RoleGuard(Role.Admin))
  admin(@Res() res: Response) {
    return res.render('dashboard/index', { layout: 'main' });
  }

}
