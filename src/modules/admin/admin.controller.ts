import { Controller, Get, Render, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';

@Controller()
export class AdminController {
  constructor(private readonly appService: AdminService) {}

  @Get()
  root(@Res() res: Response) {
    return res.render('roles/admin/dashboard', { layout: 'main' });
  }

  @Get('users')
  users(@Res() res: Response) {
    return res.render('roles/admin/user_index', { layout: 'admin' });
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