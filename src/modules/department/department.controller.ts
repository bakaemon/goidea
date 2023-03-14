import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';
const mainLayout = "dashboard/main"
@Controller()
export class DepartmentController {
  constructor() { }

  @Get()
  root(@Res() res: Response) {
    return res.render('dashboard/departments/dashboard', { layout: mainLayout });
  }
}