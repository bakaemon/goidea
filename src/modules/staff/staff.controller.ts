import { Controller, Get, Render, Res, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { Response } from 'express';
import HttpRoleGuard from '@src/common/guards/http-role.guard';
import Role from '@src/common/enums/role.enum';

@Controller()
// @UseGuards(HttpRoleGuard(Role.Staff))
export class StaffController {
  constructor(private readonly appService: StaffService) {}

  @Get()
  root(@Res() res: Response) {
    return res.render('roles/staff/staff_index', { layout: 'main' });
  }
  @Get('upload')
  upload(@Res() res: Response) {
    return res.render('roles/staff/upload_index', { layout: 'main' });
  }
  @Get('listidea')
  idea(@Res() res: Response) {
    return res.render('roles/staff/pop_idea', { layout: 'main' });
  }
}