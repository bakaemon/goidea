import { Body, Controller, Post, Res, UseGuards, HttpStatus, Put, Get, Param, Patch, Delete } from '@nestjs/common';
import Role from '@src/common/enums/role.enum';
import { Response } from 'express';
import { DepartmentDto } from '../department/dto/department.dto';
import { CategoryService } from './category.service';
import RoleGuard from '@src/common/guards/role.guard';

@Controller('api')
export class CategoryAPIController {
    constructor(
        private readonly service: CategoryService,
    ) { }
    @Post("create")
    @UseGuards(RoleGuard(Role.Admin))
    async create(@Body() {name} : {name: String}, @Res() res: Response) {
        try {
            await this.service.create({name: name});
            return {
                success: true,
                message: "Created category successfully"
            }

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    @Get("all")
    async getAll() {
        return await this.service.findAll({});
    }

    @Get(":id")
    async getById(@Param() id: String, @Res() res: Response) {
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
    async update(
        @Param() id: String,
        @Body() { name }: { name: String }, @Res() res: Response
    ) {
        try {
            await this.service.update({ _id: id }, {name: name});
            return {
                success: true,
                message: "Update category successfully"
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
                message: "Deleted category successfully"
            }

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }




}