import { Controller, Get, Param, Query, Render, Res, UseFilters, UseGuards } from '@nestjs/common';
import Role from '@src/common/enums/role.enum';
import { HttpAuthFilter } from '@src/common/filters/http-unauthorize-filter';
import HttpRoleGuard from '@src/common/guards/http-role.guard';
import RoleGuard from '@src/common/guards/role.guard';
import { Response } from 'express';

@Controller()
@UseFilters(HttpAuthFilter)
export class IdeaController {
    @Get()
    @UseGuards(HttpRoleGuard(Role.Admin))
    root(@Res() res: Response) {
        return res.render('dashboard/ideas/dashboard', { layout: 'dashboard/main' });
    }

    // edit own idea
    @Get('edit/:id')
    @UseGuards(RoleGuard(Role.Staff))
    edit(@Res() res: Response, @Param('id') id: string) {
        return res.render('main/edit_idea', { layout: 'main/home', id });
    }
}