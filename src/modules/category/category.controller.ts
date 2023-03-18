import { Controller, Get, Render, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import RoleGuard from '@src/common/guards/role.guard';
import Role from '@src/common/enums/role.enum';
import HttpRoleGuard from '@src/common/guards/http-role.guard';
const mainLayout = 'dashboard/main';
@Controller()

export class CategoryController {
  constructor() {}

  @Get()
  @UseGuards(HttpRoleGuard(Role.Admin))
  root(@Res() res: Response) {
    return res.render('dashboard/category/index', { layout: mainLayout });
  }
}
