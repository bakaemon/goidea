import { Controller, Get, Render } from '@nestjs/common';
import { AdminService } from '../../services/roles/admin.service';

@Controller()
export class AdminController {
  constructor(private readonly appService: AdminService) {}

  @Get()
  @Render('admin_index')
  root() {
    return { };
  }
}