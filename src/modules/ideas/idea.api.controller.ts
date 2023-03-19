import { Controller, Post, UseGuards, Body, Res, HttpStatus, Get, Param, Patch, Delete, Query, HttpException } from '@nestjs/common';
import Role from "@src/common/enums/role.enum";
import RoleGuard from "@src/common/guards/role.guard";
import { Response } from "express";
import { IdeaService } from "./idea.service";
import { AuthGuard } from '../../common/guards/auth.guard';
import { AccountDecorator } from "@src/common/decorators/account.decorator";
import { AccountDocument } from '../accounts/schema/account.schema';
import { IdeaDto } from './dto/idea.dto';
import { Idea } from './schema/idea.schema';
import * as mongoose from 'mongoose';
@Controller('api')
export class IdeaAPIController {
    constructor(
        private readonly service: IdeaService,
    ) { }

    // Basic CRUD
    @Post("create")
    @UseGuards(AuthGuard)
    async create(@Body() ideaDto: IdeaDto, @AccountDecorator() account: AccountDocument, @Res() res: Response) {
        try {
            ideaDto.author = account._id;
            await this.service.create(ideaDto);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Created Idea successfully"
            });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    @Get("all")
    async getAll(@Query() { page, limit, sort, sortMode }: { page?: number, limit?: number, sort?: string, sortMode?: any },
    @Res() res: Response) {
        if (!page) page = 1;
        var ideas = await this.service.findAll({}, { 
            page: page || 1, 
            limit: limit || 10, 
            sort: sort? { [sort]: sortMode } : null,
            populate: [
                { path: "author"},
                { path: "event"}
            ]
        });
        let promisedIdeas = await Promise.all(ideas.data.map(async (idea) => {
            let newIdea = idea.toObject();
            newIdea.votes = await this.service.countVote(idea._id);
            return newIdea;
        }));
        var results = {
            data: promisedIdeas,
            paginationOptions: ideas.paginationOptions
        }
        return res.json(results);
    }

    @Get(":id")
    async getById(@Param('id') id: string, @Res() res: Response) {
        try {
            return await this.service.findOne({ _id: new mongoose.Types.ObjectId(id)});
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
        @Body() ideaDto: IdeaDto, @Res() res: Response
    ) {
        try {
            await this.service.update({ _id: id }, ideaDto);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Update Idea successfully"
            });

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
            if (account._id != id) throw new HttpException("You can't delete other people's idea!",
                HttpStatus.FORBIDDEN);
            await this.service.delete({ _id: id });
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Deleted Idea successfully"
            });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    // Advanced CRUD
    @Get('comments/all')
    async getAllCommentsByIdeaId(@Query('id') ideaId: string, @Res() res: Response) {
        try {
            let comments;
            if (ideaId) {
                comments = res.json(await this.service.findCommentsByIdeaId(ideaId));
            } else comments = res.json(await this.service.findALlComment({}));
            return comments;
        } catch (error) {   
            console.log(error);
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: error.message
            });
        }
    }


    @Post(':id/vote/:type')
    @UseGuards(AuthGuard)
    async vote(@AccountDecorator() account: AccountDocument,
        @Param() id: string, @Param('type') type: string, @Res() res: Response) {
        try {
            if (type == 'upvote') {
                await this.service.upvote(id, account._id);
            } else if (type == 'downvote') {
                await this.service.downvote(id, account._id);
            } else {
                throw new HttpException("Invalid type!", HttpStatus.BAD_REQUEST);
            }
            return res.status(HttpStatus.OK).json({
                success: true,
                type,
                message: "Voted Idea successfully"
            });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }


}