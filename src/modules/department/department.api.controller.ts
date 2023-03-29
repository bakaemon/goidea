import { Body, Controller, Post, Res, UseGuards, HttpStatus, Put, Get, Param, Patch, Delete } from '@nestjs/common';
import { DepartmentService } from "./department.service";
import RoleGuard from '@common/guards/role.guard';
import Role from '@src/common/enums/role.enum';
import { DepartmentDto } from './dto/department.dto';
import { Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';

@Controller('api')
export class DepartmentAPIController {
    constructor(
        private readonly service: DepartmentService,
    ) { }
    @Post("create")
    @UseGuards(RoleGuard(Role.Admin))
    async createDepartment(@Body() departmentDto: DepartmentDto, @Res() res: Response) {
        try {
            await this.service.create(departmentDto);
            return res.status(HttpStatus.CREATED).json({
                success: true,
                message: "Create department successfully"
            });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    @Get("all")
    async getAllDepartment(@Res() res: Response) {
        return res.json(await this.service.findAll({}));
    }

    @Get(":id")
    async getDepartmentById(@Param() id: string, @Res() res: Response) {
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
    async updateDepartment(
        @Param() id: string,
        @Body() departmentDto: DepartmentDto, @Res() res: Response
    ) {
        try {
            await this.service.update({ _id: new mongoose.Types.ObjectId(id) }, departmentDto);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Update department successfully"
            });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    @Delete(':id/delete')
    @UseGuards(RoleGuard(Role.Admin))
    async delete(@Param() id: string, @Res() res: Response) {
        try {
            await this.service.delete({ _id: new mongoose.Types.ObjectId(id) });
            return res.json({
                success: true,
                message: "Deleted department successfully"
            });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }


}