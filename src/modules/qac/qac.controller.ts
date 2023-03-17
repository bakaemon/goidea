import { Controller, Get, Render, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import HttpRoleGuard from '@src/common/guards/http-role.guard';
import Role from '@src/common/enums/role.enum';
import { get } from 'http';
import { QacService } from './qac.service';
const mainLayout = "dashboard/main"
const homeLayout = "main/home"

@Controller()
// @UseGuards(HttpRoleGuard(Role.QAC))
export class QacController {
    constructor(private readonly appService: QacService) {}
    @Get('')
    index(@Res() res: Response) {
        return res.render('dashboard/roles/qac/home', { layout: homeLayout });
    }
}