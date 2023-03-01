import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";

@Controller()
export class TestController {
    constructor() { }
    
    @Get("/test")
    test(@Res() res: Response) {
        return res.render('test', { layout: 'main' });
    }
}