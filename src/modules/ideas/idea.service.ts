import mongoose from 'mongoose';
import { BaseService } from '../../common/service/base.service';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, FilterQuery, QueryOptions, Document, Types, PaginateOptions } from 'mongoose';
import { Idea, IdeaDocument } from './schema/idea.schema';
import { VotesDocument } from './schema/votes.schema';
import { filter } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Flag } from '@src/common/enums/flag.enum';
import { CommentDocument } from './schema/comment.schema';
import * as paginate from 'mongoose-paginate-v2';
export class IdeaService extends BaseService<IdeaDocument> {
    constructor(
        @InjectModel('Idea') private ideaModel: PaginateModel<IdeaDocument>,
        @InjectModel('Votes') private votesModel: PaginateModel<VotesDocument>,
        @InjectModel('Comment') private commentModel: PaginateModel<CommentDocument>,
    ) {
        super(ideaModel);
    }

    async create(idea: Partial<IdeaDocument>) {
        try {
            const ideaDoc = await this.ideaModel.create(idea);
            await this.votesModel.create({ idea: ideaDoc._id });
            return ideaDoc;
        } catch (error) {
            throw error;
        }
    }

    async upvote(ideaId: string, voter: string) {
        const vote = await this.votesModel.findOne({ idea: new mongoose.Types.ObjectId });
        if (vote.upvoter.includes(voter)) {
            this.removeVote(ideaId, voter, "upvote");
        } else {
            vote.upvoter.push(voter);
            await vote.save();
        }
    }

    async downvote(ideaId: string, voter: string) {
        const vote = await this.votesModel.findOne({ idea: new mongoose.Types.ObjectId });
        if (vote) {
            this.removeVote(ideaId, voter, "downvote");
        } else {
            vote.downvoter.push(voter);
            await vote.save();
        }
    }
    async removeVote(ideaId: string, voter: string, voteType: string) {
        try {
            const vote = await this.votesModel.findOne({ idea: ideaId });
            if (voteType === "upvote") {
                vote.upvoter = vote.upvoter.filter((v) => v !== voter);
                vote.save();
            } else if (voteType === "downvote") {
                vote.downvoter = vote.downvoter.filter((v) => v !== voter);
                vote.save();
            } else {
                throw new Error("Invalid vote type");
            }
        } catch (error) {
            throw error;
        }
    }

    async countVote(ideaId: string){
        const vote = await this.votesModel.findOne({ idea: ideaId });
        return vote.upvoter.length - vote.downvoter.length;
    }

    async findAll(filter:QueryOptions,paginateOptions?: PaginateOptions) {
        try {
            const paginateResults = await this.ideaModel.paginate(filter, paginateOptions);
            let ideas = paginateResults.docs;
            delete paginateResults.docs;
            return { data: ideas, paginationOptions: paginateResults };
        } catch (error) {
            throw error;
        }
    }

    async deleteOne(filter: FilterQuery<IdeaDocument>, options?: QueryOptions) {
        try {
            const idea = await this.ideaModel.findOne(filter, options);
            if (!idea) throw new HttpException("Idea not found", 404);
            if (idea.flag.includes(Flag.Deleted)) throw new HttpException("Idea already deleted", 400);
            idea.flag.push(Flag.Deleted);
            return idea;
        } catch (error) {
            throw error;
        }
    }

    async findALlComment(options?: QueryOptions) {
        try {
            const paginateResults = await this.commentModel.paginate({}, options);
            const comments = paginateResults.docs;
            delete paginateResults.docs;
            return { data: comments, paginationOptions: paginateResults };
        } catch (error) {
            throw error;
        }
    }

    async findCommentsByIdeaId(ideaId: string, options?: QueryOptions) {
        try {
            const paginateResults = await this.commentModel.paginate({ idea: ideaId}, options);
            const comments = paginateResults.docs;
            delete paginateResults.docs;
            return { data: comments, paginationOptions: paginateResults };
        }
        catch (error) {
            throw error;
        }
    }

    // event that runs every 24 hours
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async dailyEvent() {
        await this.checkCloseDate();
    }
    // event that runs every month
    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
    async monthlyEvent() {
        await this.cleanDeletedIdeas();
    }

    // clean deleted ideas
    async cleanDeletedIdeas() {
        const ideas = await this.ideaModel.find({ flag: Flag.Deleted });
        if (!ideas) return;
        ideas.forEach(async (idea) => {
            if (idea.flag.includes(Flag.Deleted)) {
                await this.ideaModel.deleteOne({ _id: idea._id });
                await this.votesModel.deleteOne({ idea: idea._id });
                await this.commentModel.deleteMany({ idea: idea._id });
            }
        });
    }
    // check if close date is passed
    async checkCloseDate() {
        const ideas = await this.ideaModel.find({ closureDate: { $lt: new Date() } });
        if (!ideas) return;
        ideas.forEach(async (idea) => {
            if (idea.flag.includes(Flag.Open)) {
                idea.flag[idea.flag.indexOf(Flag.Open)] = Flag.Closed;
                await idea.save();
            }
        });
    }



}