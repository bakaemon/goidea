import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class IdeaController {
    @Get()
    root(@Res() res: Response) {
        return res.render('ideas/dashboard', { layout: 'main' });
    }
}