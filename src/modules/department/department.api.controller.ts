import { Body, Controller, Post, Res, UseGuards, HttpStatus, Put, Get, Param, Patch } from '@nestjs/common';
import { DepartmentService } from "./department.service";
import RoleGuard from '../../../dist/common/guards/role.guard';
import Role from '@src/common/enums/role.enum';
import { DepartmentDto } from './dto/department.dto';
import { Response } from 'express';

@Controller('api')
export class DepartmentAPIController{
    constructor(
        private readonly departmentService: DepartmentService,
    ) { }
    @Post("create")
    @UseGuards(RoleGuard(Role.Admin))
    async createDepartment(@Body() departmentDto: DepartmentDto, @Res() res : Response) {
        try {
            await this.departmentService.create(departmentDto);
            return {
                success: true,
                message: "Create department successfully"
            }

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    @Get("all")
    async getAllDepartment() {
        return await this.departmentService.findAll({});
    }

    @Get(":id")
    async getDepartmentById(@Param() id: String, @Res() res: Response) {
        try {
            return await this.departmentService.findOne({ _id: id });
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
            await this.departmentService.update({_id: id}, departmentDto);
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


}