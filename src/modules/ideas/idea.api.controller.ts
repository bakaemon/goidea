import { Controller, Post, UseGuards, Body, Res, HttpStatus, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import Role from "@src/common/enums/role.enum";
import RoleGuard from "@src/common/guards/role.guard";
import { Response } from "express";
import { IdeaService } from "./idea.service";
import { AuthGuard } from '../../common/guards/auth.guard';
import { AccountDecorator } from "@src/common/decorators/account.decorator";
import { AccountDocument } from '../accounts/schema/account.schema';

@Controller('api')
export class IdeaAPIController {
    constructor(
        private readonly service: IdeaService,
    ) { }

    // Basic CRUD
    @Post("create")
    async create(@Body() ideaDto: any, @Res() res: Response) {
        try {
            await this.service.create(ideaDto);
            return {
                success: true,
                message: "Created Idea successfully"
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
    @UseGuards(AuthGuard)
    async update(
        @Param() id: String,
        @Body() { name }: { name: String }, @Res() res: Response
    ) {
        try {
            await this.service.update({ _id: id }, { name: name });
            return {
                success: true,
                message: "Update Idea successfully"
            }

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    @Delete(':id/delete')
    @UseGuards(AuthGuard)
    async delete(@AccountDecorator() account: AccountDocument, @Param() id: String, @Res() res: Response) {
        try {
            if (account._id != id) throw new Error("You can't delete other people's idea!");
            await this.service.delete({ _id: id });
            return {
                success: true,
                message: "Deleted Idea successfully"
            }

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    @Post(':id/upvote')
    @UseGuards(AuthGuard)
    async vote(@AccountDecorator() account: AccountDocument, @Param() id: string, @Query('type') type: string , @Res() res: Response) {
        try {
            if (type == 'upvote') {
                await this.service.upvote(id, account._id);
            } else if (type == 'downvote') {
                await this.service.downvote(id, account._id);
            } else {
                throw new Error("Invalid type!");
            }
            return {
                success: true,
                type,
                message: "Voted Idea successfully"
            }

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }


}