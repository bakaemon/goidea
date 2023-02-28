import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class IdeaController {
    @Get('ideas')
    root(@Res() res: Response) {
        return res.render('roles/staff/staff_index', { layout: 'main' });
    }
}