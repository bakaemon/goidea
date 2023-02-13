import { Controller, Get, Render } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get()
  @Render('user_index')
  root() {
    return { };
  }
}