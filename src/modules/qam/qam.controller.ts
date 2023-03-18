import { Controller, Get, Render, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import HttpRoleGuard from '@src/common/guards/http-role.guard';
import Role from '@src/common/enums/role.enum';
import { QamService } from './qam.service';
import { get } from 'http';
import RoleGuard from '@src/common/guards/role.guard';
const mainLayout = "dashboard/main"
const homeLayout = "main/home"
@Controller()
// @UseGuards(HttpRoleGuard(Role.QAM))
export class QamController {
    constructor(private readonly appService: QamService) {}
    
    @Get('dashboard')
    @UseGuards(HttpRoleGuard(Role.Admin))
    root(@Res() res: Response) {
        return res.render('dashboard/roles/qam/dashboard', { layout: mainLayout });
    }

    @Get('test')
    test(@Res() res: Response) {
        return res.render('dashboard/roles/qam/test', { layout: mainLayout });
    }

    @Get('')
    index(@Res() res: Response) {
        return res.render('dashboard/roles/qam/home', { layout: homeLayout });
    }
}
