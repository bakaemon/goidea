import { Controller, Get, Render, Res, UseGuards } from '@nestjs/common';
import Role from '@src/common/enums/role.enum';
import HttpRoleGuard from '@src/common/guards/http-role.guard';
import RoleGuard from '@src/common/guards/role.guard';
import { Response } from 'express';

@Controller()
export class IdeaController {
    @Get()
    @UseGuards(HttpRoleGuard(Role.Admin))
    root(@Res() res: Response) {
        return res.render('dashboard/ideas/dashboard', { layout: 'dashboard/main' });
    }
}