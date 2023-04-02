import { Body, Controller, Post, Res, UseGuards, HttpStatus, Put, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import Role from '@src/common/enums/role.enum';
import { Response } from 'express';
import { DepartmentDto } from '../department/dto/department.dto';
import { CategoryService } from './category.service';
import RoleGuard from '@src/common/guards/role.guard';
import mongoose, { ObjectId } from 'mongoose';

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
            return res.json({
                success: true,
                message: "Created category successfully"
            });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    @Get("all")
    async getAll(@Query() { page, limit, sort, sortMode }: { page?: number, limit?: number, sort?: string, sortMode?: any }) {
        if (!page) page = 1;
        if (!limit) limit=100;
        return await this.service.findAll({}, { page, limit, sort: sort? { [sort]: sortMode } : null});
    }

    @Get(":id")
    async getById(@Param() id: string, @Res() res: Response) {
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
    async update(
        @Param() id: string,
        @Body() { name }: { name: String }, @Res() res: Response
    ) {
        try {
            await this.service.update({ _id: new mongoose.Types.ObjectId(id) }, {name: name});
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Update category successfully"
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
                message: "Deleted category successfully"
            })

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }




}