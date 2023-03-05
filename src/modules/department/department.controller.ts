import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class DepartmentController {
  constructor() {}

  @Get()
  root(@Res() res: Response) {
    return res.render('departments/dashboard', { layout: 'main' });
  }
}