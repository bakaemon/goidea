import { Controller, Get, Render, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import HttpRoleGuard from '@src/common/guards/http-role.guard';
import Role from '@src/common/enums/role.enum';
import { QamService } from './qam.service';
import { get } from 'http';
import RoleGuard from '@src/common/guards/role.guard';
import { HttpAuthFilter } from '@src/common/filters/http-unauthorize-filter';
const mainLayout = "dashboard/main"
const homeLayout = "main/home"
@Controller()
@UseFilters(HttpAuthFilter)
export class QamController {
    constructor(private readonly appService: QamService) {}
    
    @Get('dashboard/home')
    @UseGuards(HttpRoleGuard(Role.QAM))
    root(@Res() res: Response) {
        return res.render('dashboard/roles/qam/dashboard', { layout: mainLayout });
    }

    @Get('download')
    @UseGuards(HttpRoleGuard(Role.QAM))
    download(@Res() res: Response) {
        return res.render('dashboard/roles/qam/download', { layout: mainLayout });
    }

    @Get('dashboard/chart')
    @UseGuards(HttpRoleGuard(Role.QAM))
    rootTest(@Res() res: Response) {
        return res.render('dashboard/roles/qam/chart', { layout: mainLayout });
    }

}
