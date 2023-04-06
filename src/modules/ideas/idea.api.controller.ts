import { ExceptionFilter, UploadedFile, UseInterceptors, ParseFilePipe, FileValidator, FileTypeValidator, UploadedFiles, Put, Req } from '@nestjs/common';
import { Controller, Post, UseGuards, Body, Res, HttpStatus, Get, Param, Patch, Delete, Query, HttpException } from '@nestjs/common';
import Role from "@src/common/enums/role.enum";
import RoleGuard from "@src/common/guards/role.guard";
import { Response } from "express";
import { IdeaService } from "./idea.service";
import { AuthGuard } from '../../common/guards/auth.guard';
import { AccountDecorator } from "@src/common/decorators/account.decorator";
import { AccountDocument, Account } from '../accounts/schema/account.schema';
import { IdeaDto } from './dto/idea.dto';
import { Idea, IdeaDocument } from './schema/idea.schema';
import * as mongoose from 'mongoose';
import { TagService } from '../tag/tag.service';
import { ExecException } from 'child_process';
import { FileInterceptor, AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from '@modules/auth/auth.service';
import { CategoryService } from '../category/category.service';
import { EmailTransporter } from '@src/common/email/email-transporter';
import { AccountsService } from '../accounts/accounts.service';
@Controller('api')
export class IdeaAPIController {
    constructor(
        private readonly service: IdeaService,
        private readonly tagService: TagService,
        private readonly authService: AuthService,
        private readonly categoryService: CategoryService,
        private readonly emailTransporter: EmailTransporter,
        private readonly accountService: AccountsService
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
            var idea = await this.service.create(ideaData);
            await this.notifyQAC(idea._id, ideaData, account);
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
    async getAll(@Query() { keyword, page, limit, sort, sortMode }: { keyword?: string, page?: number, limit?: number, sort?: string, sortMode?: any },
        @Res() res: Response) {
        if (!page) page = 1;
        var filter = {};
        if (keyword) {
            filter["$or"] = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ];
            // look for tags that match the keyword
            var tags = await this.tagService.findAll({ name: { $regex: keyword, $options: "i" } });
            if (tags.data.length > 0) {
                filter["$or"].push({ tags: { $in: tags.data.map(tag => tag._id) } });
            }
            // look for categories that match the keyword
            var categories = await this.categoryService.findAll({ name: { $regex: keyword, $options: "i" } });
            if (categories.data.length > 0) {
                filter["$or"].push({ category: { $in: categories.data.map(category => category._id) } });
            }
        }
        var options = {
            page: page || 1,
            limit: limit || 10,
            sort: sort ? { [sort]: sortMode } : null,
            populate: [
                { path: "author" },
                { path: "event" },
                { path: "tags" },
                { path: "category" }

            ]
        };
        var ideas = await this.service.findAll(filter, options);
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
                        { path: 'tags' },
                        { path: 'category' },

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
        @Param() id: string,
        @Body() ideaDto: IdeaDto, @Res() res: Response
    ) {
        try {
            await this.service.update({ _id: new mongoose.Types.ObjectId(id) }, ideaDto);
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
    async delete(@AccountDecorator() account: AccountDocument, @Param() id: string, @Res() res: Response) {
        try {
            if (!account && !account.roles.includes(Role.Admin)) throw new HttpException("You can't delete other people's idea!",
                HttpStatus.FORBIDDEN);
            await this.service.delete({ _id: new mongoose.Types.ObjectId(id) });
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
    async getAllCommentsByIdeaId(@Param('id') ideaId: string, @Res() res: Response, @Req() req: any) {
        try {
            var dataResults = await this.service.findCommentsByIdeaId(ideaId, {
                populate: [
                    { path: "author" },
                ]
            });
            var comments = dataResults.data;
            delete dataResults.data;
            var token = req.cookies['token'];
            var results;
            if (token) {
                var account = await this.authService.verifyTokenFromRequest(token, 'jwt.accessTokenPrivateKey');
                const checkVote = (comment) => {
                    if (comment.upvoter.includes(account._id.toString())) {
                        return "upvoted";
                    }
                    else if (comment.downvoter.includes(account._id.toString())) {
                        return "downvoted";
                    }
                    else {
                        return "not voted";
                    }
                };
                results = [...comments.map(comment => {
                    var newComment = comment.toObject();
                    newComment.voteStatus = checkVote(comment);
                    newComment.voteCount = comment.upvoter.length - comment.downvoter.length;
                    delete newComment.upvoter;
                    delete newComment.downvoter;
                    return newComment;
                })];
            } else {
                results = [...comments.map(comment => {
                    var newComment = comment.toObject();
                    newComment.voteStatus = "not voted";
                    newComment.voteCount = comment.upvoter.length - comment.downvoter.length;
                    delete newComment.upvoter;
                    delete newComment.downvoter;
                    return newComment;
                })];
            }

            return res.json({
                data: results,
                ...dataResults
            });

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
        @Body() { content }: { content: string },
        @Res() res: Response) {
        try {
            var idea = await (await this.service.findOne({ _id: new mongoose.Types.ObjectId(ideaID) })).populate('author');
            var comment = await this.service.createComment(ideaID, content, account._id);
            var ideaObj = idea.toObject();
            if (idea.isNotified) {
                this.emailTransporter.sendMail({
                    from: "GOIDEA<no-reply>",
                    to: ideaObj.author.email, // change to your email you want to send to
                    subject: `You just receive an comment! from another ${account.username}`,
                    html: `<h1>GOIDEA</h1><p>You just receive an comment! from ${account.username}.</p>
                    <p>Click <a href="https://${process.env.DOMAIN}/home/idea/${idea._id}">right here</a> to view the comment.</p>`,
                });
            }
            return res.status(HttpStatus.OK).json({
                success: true,
                data: comment,
                message: "Created Comment successfully"
            });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    //vote comment
    @Put(':id/comments/:commentId/vote/:type')
    @UseGuards(AuthGuard)
    async voteComment(@AccountDecorator() account: AccountDocument,
        @Param() id: string, @Param('commentId') commentId: string, @Param('type') type: string, @Res() res: Response) {
        try {
            // refresh vote
            let vote;
            if (type == 'upvote') {
                vote = await this.service.upvoteComment(commentId, account._id);
            } else if (type == 'downvote') {
                vote = await this.service.downvoteComment(commentId, account._id);
            } else {
                throw new HttpException("Invalid type!", HttpStatus.BAD_REQUEST);
            }
            return res.status(HttpStatus.OK).json({
                success: true,
                type,
                data: vote.upvoter.length - vote.downvoter.length,
                message: "Voted Comment successfully"
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
            var token = req.cookies['token'];
            var voteStatus = null;
            if (token) {
                var account = await this.authService.verifyTokenFromRequest(token,
                    'jwt.accessTokenPrivateKey');
                if (account) {
                    voteStatus = await this.service.checkVoted(id, account._id.toString())
                }
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

    //search ideas
    @Get("search")
    async search(@Res() res: Response, @Query() query: {
        keyword: string,
        page?: number,
        limit?: number,
        sort?: string,
        sortMode?: string,
    }) {
        try {
            var { keyword, page, limit, sort, sortMode } = query;
            var filter = {
                $or: [
                    { title: { $regex: keyword, $options: 'i' } },
                    { content: { $regex: keyword, $options: 'i' } },
                    { tags: [{ $elemMatch: { name: { $regex: keyword, $options: 'i' } } }] },
                    { category: { $elemMatch: { name: { $regex: keyword, $options: 'i' } } } },
                ]
            };
            var options = {
                page: page || 1,
                limit: limit || 10,
                sort: sort ? { [sort]: sortMode } : null,
                populate: [
                    { path: "author" },
                    { path: "event" },
                    { path: "tags" },
                    { path: "category" }

                ]
            };
            return res.json(await this.service.findAll(filter, options));
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: error.message
            });
        }
    }

    // notification to qac when a new idea is created
    async notifyQAC( id, idea: any, author: AccountDocument) {
        var qacs = await this.accountService.findAll({ roles: { $in: ['qac'] } },);
        var ideaObj = idea;
        qacs.data.forEach(async (qac) => {
            this.emailTransporter.sendMail({
                from: "GOIDEA<no-reply>",
                to: qac.email, // change to your email you want to send to
                subject: `${author.username} just uploaded an idea!`,
                html: `<h1>GOIDEA</h1><p>${author.username} just uploaded an idea!.</p>
                <p>Click <a href="https://${process.env.DOMAIN}/home/idea/${id}">${idea.title}</a> to view the idea.</p>`,
            });
        });

    }
}


