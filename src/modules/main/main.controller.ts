import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

const homeLayout = "main/home"
@Controller()
export class MainController {
    @Get()
    root(@Res() res: Response) {
        return res.render('main/index', { layout: homeLayout });
    }
    @Get('idea/')
    ideaDetail(@Param() id : string, @Res() res: Response) {
    return res.render('main/idea', { layout: homeLayout });
  }
}