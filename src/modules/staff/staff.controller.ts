import { Controller, Get, Render, Res, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { Response } from 'express';
import HttpRoleGuard from '@src/common/guards/http-role.guard';
import Role from '@src/common/enums/role.enum';
const mainLayout = "dashboard/main"
@Controller()
// @UseGuards(HttpRoleGuard(Role.Staff))
export class StaffController {
  constructor(private readonly appService: StaffService) { }
  

  @Get()
  root(@Res() res: Response) {
    return res.render('dashboard/roles/staff/staff_index', { layout: mainLayout });
  }
  @Get('upload')
  upload(@Res() res: Response) {
    return res.render('dashboard/roles/staff/upload_index', { layout: mainLayout });
  }
  @Get('listidea')
  idea(@Res() res: Response) {
    return res.render('dashboard/roles/staff/pop_idea', { layout: mainLayout });
  }
  @Get('like')
  like(@Res() res: Response) {
    return res.render('dashboard/roles/staff/like_idea', { layout: mainLayout });
  }
  @Get('dislike')
  dislike(@Res() res: Response) {
    return res.render('dashboard/roles/staff/dislike_idea', { layout: mainLayout });
  }
  @Get('comment')
  comment(@Res() res: Response) {
    return res.render('dashboard/roles/staff/comment_idea', { layout: mainLayout });
  }
  @Get('view')
  view(@Res() res: Response) {
    return res.render('dashboard/roles/staff/view_idea', { layout: mainLayout });
  }
}