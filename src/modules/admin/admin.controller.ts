import { Controller, Get, Render, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
import Role from '@src/common/enums/role.enum';
import RoleGuard from '@src/common/guards/role.guard';
import { HttpAuthFilter } from '@common/filters/http-unauthorize-filter';
import HttpRoleGuard from '@src/common/guards/http-role.guard';

@Controller()
@UseFilters(HttpAuthFilter)
@UseGuards(HttpRoleGuard(Role.Admin))
export class AdminController {
  constructor(private readonly appService: AdminService) { }

  @Get()
  root(@Res() res: Response) {
    return res.render('roles/admin/dashboard', { layout: 'main' });
  }

  @Get('users')
  users(@Res() res: Response) {
    return res.render('roles/admin/user_index', { layout: 'main' });
  }

  @Get('users/create')
  createUsers(@Res() res: Response) {
    return res.render('roles/admin/CreateUsers_index', { layout: 'main' });
  }

  @Get('organization')
  Organization(@Res() res: Response) {
    return res.render('organizations/dashboard', { layout: 'auth' });
  }

  @Get('organization/create')
  createOrganization(@Res() res: Response) {
    return res.render('organizations/organization_create', { layout: 'main' });
  }
  @Get('organization/id/departments')
  departments(@Res() res: Response) {
    return res.render('organizations/departments_create', { layout: 'main' });
  }
}