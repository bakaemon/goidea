import { Controller, Get, Param, Render, Res, UseFilters, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { Response } from 'express';
import Role from '@src/common/enums/role.enum';
import RoleGuard from '@src/common/guards/role.guard';
import { HttpAuthFilter } from '@common/filters/http-unauthorize-filter';
import HttpRoleGuard from '@src/common/guards/http-role.guard';
const mainLayout = "dashboard/main"
@Controller()
@UseFilters(HttpAuthFilter)
@UseGuards(HttpRoleGuard(Role.Admin))
export class EventController {
    constructor(private readonly appService: EventService) { }
    @Get('ideas/:id')
    events(@Res() res: Response, @Param('id') eventId: string) {
        return res.render('dashboard/ideas/details', { layout: mainLayout, eventId });
    }
}




