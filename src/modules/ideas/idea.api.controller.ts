import { ExceptionFilter, UploadedFile, UseInterceptors, ParseFilePipe, FileValidator, FileTypeValidator, UploadedFiles, Put, Req } from '@nestjs/common';
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
import { TagService } from '../tag/tag.service';
import { ExecException } from 'child_process';
import { FileInterceptor, AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from '@modules/auth/auth.service';
@Controller('api')
export class IdeaAPIController {
    constructor(
        private readonly service: IdeaService,
        private readonly tagService: TagService,
        private readonly authService: AuthService
    ) { }

    // Basic CRUD
    @Post("create")
    @UseGuards(AuthGuard)
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: './public/assets/uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        }),
    }))
    async create(@Body() ideaDto: IdeaDto, @UploadedFiles() files: Array<Express.Multer.File>,
        @AccountDecorator() account: AccountDocument,
        @Res() res: Response) {
        console.log(files);
        try {

            ideaDto.author = account._id;
            var tagNames = ideaDto.tags.split(",");
            delete ideaDto.tags;
            var newTags = [];
            for (var tagName of tagNames) {
                try {
                    var tagCheck = await this.tagService.findOne({ name: tagName });
                    newTags.push(tagCheck._id.toString());
                }
                catch (e) {
                    var newTag = await this.tagService.create({ name: tagName });
                    newTags.push(newTag._id.toString());
                }
            }
            var ideaData = {
                ...ideaDto,
                files: files ? files.map(file => file.filename) : [],
                tags: newTags
            }
            await this.service.create(ideaData);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Created Idea successfully"
            });

        } catch (error) {
            console.log(error.toString());
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
            sort: sort ? { [sort]: sortMode } : null,
            populate: [
                { path: "author" },
                { path: "event" }
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
            return res.json(await this.service.findOne({ _id: new mongoose.Types.ObjectId(id) },
                {
                    populate: [
                        { path: "author" },
                    ]
                }))
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
    @Get(':id/comments/all')
    async getAllCommentsByIdeaId(@Param('id') ideaId: string, @Res() res: Response) {
        try {
            if (ideaId) {
                return res.json(await this.service.findCommentsByIdeaId(ideaId));
            } else return res.json(await this.service.findALlComment({}));
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: error.message
            });
        }
    }

    // post comments to selected idea includes author, ideaID, content
    @Post(':id/comments/create')
    @UseGuards(AuthGuard)
    async createComment(@AccountDecorator() account: AccountDocument,
        @Param('id') ideaID: string,
        @Body() content: string,
        @Res() res: Response) {
        try {
            await this.service.createComment(ideaID, content, account._id);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Created Comment successfully"
            });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }



    @Put(':id/vote/:type')
    @UseGuards(AuthGuard)
    async vote(@AccountDecorator() account: AccountDocument,
        @Param() id: string, @Param('type') type: string, @Res() res: Response) {
        try {
            // refresh vote
            let vote;
            if (type == 'upvote') {
                vote = await this.service.upvote(id, account._id);
            } else if (type == 'downvote') {
                vote = await this.service.downvote(id, account._id);
            } else {
                throw new HttpException("Invalid type!", HttpStatus.BAD_REQUEST);
            }
            return res.status(HttpStatus.OK).json({
                success: true,
                type,
                data: vote.upvoter.length - vote.downvoter.length,
                message: "Voted Idea successfully"
            });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    @Get(':id/vote')
    async getVote(@Param('id') id, @Res() res: Response, @Req() req: any) {
        try {
            var voteCount = await this.service.countVote(id);
            var account = await this.authService.verifyTokenFromRequest(req.cookies['refresh_token'],
                'jwt.refreshTokenPrivateKey');
            var voteStatus = null;
            if (account) {
                voteStatus = await this.service.checkVoted(id, account._id.toString())
            }
            return res.json({
                success: true,
                voteStatus,
                data: voteCount.toString(),
            })
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                messeage: e.toString()
            })
        }
    }

    // //upload file
    // @Post('file/upload')
    // @UseGuards(AuthGuard)
    // @UseInterceptors(FileInterceptor('file', {
    //     storage: diskStorage({
    //     destination: './public/assets/uploads',
    //     filename: (req, file, cb) => {
    //         const randomName = Array(32)
    //         .fill(null)
    //         .map(() => Math.round(Math.random() * 16).toString(16))
    //         .join('');
    //         return cb(null, `${randomName}${extname(file.originalname)}`);
    //     }}),
    // }))
    // async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    //     try {
    //         console.log(file);
    //         if(!file){
    //             throw new HttpException("File not found!", HttpStatus.BAD_REQUEST);
    //         } 
    //         file.filename = file.originalname;
    //         return res.json({
    //             success: true,
    //             data: file,
    //         })
    //     } catch (error) {
    //         return res.status(HttpStatus.BAD_REQUEST).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }
    // }

}


