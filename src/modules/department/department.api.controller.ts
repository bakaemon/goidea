import { Body, Controller, Post, Res, UseGuards, HttpStatus, Put, Get, Param, Patch, Delete } from '@nestjs/common';
import { DepartmentService } from "./department.service";
import RoleGuard from '@common/guards/role.guard';
import Role from '@src/common/enums/role.enum';
import { DepartmentDto } from './dto/department.dto';
import { Response } from 'express';

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
    async getAllDepartment() {
        return await this.service.findAll({});
    }

    @Get(":id")
    async getDepartmentById(@Param() id: String, @Res() res: Response) {
        try {
            return await this.service.findOne({ _id: id });
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
        @Param() id: String,
        @Body() departmentDto: DepartmentDto, @Res() res: Response
    ) {
        try {
            await this.service.update({ _id: id }, departmentDto);
            return {
                success: true,
                message: "Update department successfully"
            }

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    @Delete(':id/delete')
    @UseGuards(RoleGuard(Role.Admin))
    async delete(@Param() id: String, @Res() res: Response) {
        try {
            await this.service.delete({ _id: id });
            return {
                success: true,
                message: "Deleted department successfully"
            }

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }


}