import { Controller, Get, Render, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import HttpRoleGuard from '@src/common/guards/http-role.guard';
import Role from '@src/common/enums/role.enum';
import { QamService } from './qam.service';
import { get } from 'http';

@Controller()
// @UseGuards(HttpRoleGuard(Role.QAM))
export class QamController {
    constructor(private readonly appService: QamService) {}
    
    @Get()
    root(@Res() res: Response) {
        return res.render('dashboard/roles/qam/dashboard', { layout: 'main' });
    }

    @Get('test')
    test(@Res() res: Response) {
        return res.render('dashboard/roles/qam/test', { layout: 'main' });
    }
}
