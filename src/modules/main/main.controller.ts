import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

const homeLayout = "main/home"

@Controller()
export class MainController {
    @Get()
    root(@Res() res: Response) {
        return res.render('main/index', { layout: homeLayout });
    }
    @Get('idea/:id')
    ideaDetail(@Param('id') id : string, @Res() res: Response) {
    return res.render('main/idea', { ideaId: id.toString(), layout: homeLayout });
    }
    @Get('ideas/upload')
    upload(@Res() res: Response) {
    return res.render('main/idea_upload', {layout: homeLayout });
  }
}