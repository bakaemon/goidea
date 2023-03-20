import { Controller, Get, Render, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import RoleGuard from '@src/common/guards/role.guard';
import Role from '@src/common/enums/role.enum';
import HttpRoleGuard from '@src/common/guards/http-role.guard';
import { HttpAuthFilter } from '@src/common/filters/http-unauthorize-filter';
const mainLayout = 'dashboard/main';
@Controller()
@UseFilters(HttpAuthFilter)
export class CategoryController {
  constructor() {}

  @Get()
  @UseGuards(HttpRoleGuard(Role.QAM))
  root(@Res() res: Response) {
    return res.render('dashboard/category/index', { layout: mainLayout });
  }
}
