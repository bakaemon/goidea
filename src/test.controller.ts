import { Controller, Get, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import Role from "./common/enums/role.enum";
import HttpRoleGuard from "./common/guards/http-role.guard";
import RoleGuard from "./common/guards/role.guard";

@Controller()
export class TestController {
    constructor() { }
    
    @Get("/test")
    @UseGuards(HttpRoleGuard(Role.Admin,))
    test(@Res() res: Response) {
       return res.render('test', { layout: 'dashboard/main' });
       
    }
}