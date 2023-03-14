import { Controller, Get, Render, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
import Role from '@src/common/enums/role.enum';
import RoleGuard from '@src/common/guards/role.guard';
import { HttpAuthFilter } from '@common/filters/http-unauthorize-filter';
import HttpRoleGuard from '@src/common/guards/http-role.guard';
const mainLayout = "dashboard/main"
@Controller()
@UseFilters(HttpAuthFilter)
@UseGuards(HttpRoleGuard(Role.Admin))
export class AdminController {
  constructor(private readonly appService: AdminService) { }

  @Get()
  root(@Res() res: Response) {
    return res.render('dashboard/roles/admin/dashboard', { layout: mainLayout });
  }

  @Get('users')
  users(@Res() res: Response) {
    return res.render('dashboard/roles/admin/user_index', { layout: mainLayout });
  }

  @Get('users/create')
  createUsers(@Res() res: Response) {
    return res.render('dashboard/roles/admin/CreateUsers_index', { layout: mainLayout });
  }

  @Get('departments')
  Organization(@Res() res: Response) {
    return res.render('dashboard/departments/dashboard', { layout: mainLayout });
  }

  @Get('departments/create')
  createOrganization(@Res() res: Response) {
    return res.render('dashboard/departments/departments_create', { layout: mainLayout });
  }

  @Get('events')
  events(@Res() res: Response) {
    return res.render('dashboard/events/dashboard', { layout: mainLayout });
  }
  
}