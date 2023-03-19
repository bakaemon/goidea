import { Controller, Get, Render, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import HttpRoleGuard from '@src/common/guards/http-role.guard';
import Role from '@src/common/enums/role.enum';
import { get } from 'http';
import { QacService } from './qac.service';
import RoleGuard from '@src/common/guards/role.guard';
import { HttpAuthFilter } from '@src/common/filters/http-unauthorize-filter';
const mainLayout = "dashboard/main"
const homeLayout = "main/home"

@Controller()
@UseFilters(HttpAuthFilter)
// @UseGuards(HttpRoleGuard(Role.QAC))
export class QacController {
    constructor(private readonly appService: QacService) {}
    @Get('')
    @UseGuards(HttpRoleGuard(Role.Admin))
    index(@Res() res: Response) {
        return res.render('dashboard/roles/qac/home', { layout: homeLayout });
    }
}