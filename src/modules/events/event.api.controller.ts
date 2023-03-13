import { Body, Controller, Post, Res, UseGuards, HttpStatus, Put, Get, Param, Patch, Delete } from '@nestjs/common';
import Role from '@src/common/enums/role.enum';
import { Response } from 'express';
import RoleGuard from '@src/common/guards/role.guard';
import mongoose, { ObjectId } from 'mongoose';
import { EventDto } from './dto/event.dto';
import { EventService } from './event.service';


@Controller('api')
export class EventAPIController {
    constructor(
        private readonly service: EventService,
    ) { }
    @Post("create")
    @UseGuards(RoleGuard(Role.Admin))
    async createEvent(@Body() eventDto: EventDto, @Res() res: Response) {
        try {
            await this.service.create(eventDto);
            return res.status(HttpStatus.CREATED).json({
                success: true,
                message: "Create event successfully"
            });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    @Get("all")
    async getAllEvents(@Res() res: Response) {
        return res.json(await this.service.findAll({}));
    }

    @Get(":id")
    async getEventById(@Param() id: string, @Res() res: Response) {
        try {
            return res.json(await this.service.findOne({ _id: new mongoose.Types.ObjectId(id) }));
        } catch (error) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: error.message
            });
        }
    }

    @Patch(":id/update")
    @UseGuards(RoleGuard(Role.Admin))
    async updateEvent(
        @Param() id: string,
        @Body() eventDto: EventDto, @Res() res: Response
    ) {
        try {
            await this.service.update({ _id: new mongoose.Types.ObjectId(id) }, eventDto);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Update event successfully"
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    @Delete(":id/delete")
    @UseGuards(RoleGuard(Role.Admin))
    async deleteEvent(@Param() id: string, @Res() res: Response) {
        try {
            await this.service.delete({ _id: new mongoose.Types.ObjectId(id) });
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Delete event successfully"
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }
}