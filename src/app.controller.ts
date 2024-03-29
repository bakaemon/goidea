import { Controller, Get, Render, Res, UseGuards, Query } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { EmailTransporter } from './common/email/email-transporter';
import Role from './common/enums/role.enum';
import RoleGuard from './common/guards/role.guard';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailTransporter: EmailTransporter,
  ) { }

  @Get("/login")
  login(@Res() res: Response) {
    return res.render('login', { layout: 'login' });
  }
  @Get()
  root(@Res() res: Response) {
    return res.redirect('/home')
  }

  @Get("/admin/test")
  // @UseGuards(RoleGuard(Role.Admin))
  admin(@Res() res: Response) {
    return res.render('dashboard/index', { layout: 'dashboard/main' });
  }

  
  @Get("/testmail")
  @UseGuards(RoleGuard(Role.Admin, Role.Staff))
  async testMail() {
    try {
      await this.emailTransporter.sendMail({
        from: "GOIDEA<no-reply>",
        to: process.env.GMAIL_USER, // change to your email you want to send to
        subject: 'Test mail',
        html: '<b style="color:red">you just receive an comment! from another user</b>',
      });
      return 'Mail sent';
    } catch (error) {
      console.log(error);
      return 'Mail not sent';
    }
  }

}
