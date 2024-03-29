import { Controller, Post, UseGuards, Body, Res, HttpStatus, Get, Param, Patch, Delete } from "@nestjs/common";
import Role from "@src/common/enums/role.enum";
import RoleGuard from "@src/common/guards/role.guard";
import { Response } from "express";
import { TagService } from "./tag.service";

@Controller('api')
export class TagAPIController {
    constructor(
        private readonly service: TagService,
    ) { }
    @Post("create")
    @UseGuards(RoleGuard(Role.Admin))
    async create(@Body() { name }: { name: String }, @Res() res: Response) {
        try {
            await this.service.create({ name: name });
            return {
                success: true,
                message: "Created tag successfully"
            }

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    @Get("all")
    async getAll(@Res() res: Response) {
        var tags = await this.service.findAll({});
        return res.status(HttpStatus.OK).json(tags);
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
            await this.service.update({ _id: id }, { name: name });
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