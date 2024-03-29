import { Controller, Get, Render, Res, UseFilters, UseGuards } from '@nestjs/common';
import Role from '@src/common/enums/role.enum';
import { HttpAuthFilter } from '@src/common/filters/http-unauthorize-filter';
import HttpRoleGuard from '@src/common/guards/http-role.guard';
import RoleGuard from '@src/common/guards/role.guard';
import { Response } from 'express';
const mainLayout = "dashboard/main"
@Controller()
@UseFilters(HttpAuthFilter)
export class DepartmentController {
  constructor() { }

  @Get()
  @UseGuards(HttpRoleGuard(Role.Admin))
  root(@Res() res: Response) {
    return res.render('dashboard/departments/dashboard', { layout: mainLayout });
  }
}