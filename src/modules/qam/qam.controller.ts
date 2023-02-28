import { Controller, Get, Render, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import HttpRoleGuard from '@src/common/guards/http-role.guard';
import Role from '@src/common/enums/role.enum';
import { QamService } from './qam.service';

@Controller()
// @UseGuards(HttpRoleGuard(Role.QAM))
export class QamController {
    constructor(private readonly appService: QamService) {}
    
    @Get()
    root(@Res() res: Response) {
        return res.render('roles/qam/dashboard', { layout: 'main' });
    }
}
