import mongoose, { Query } from 'mongoose';
import { BaseService } from '../../common/service/base.service';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, FilterQuery, QueryOptions, Document, Types, PaginateOptions, QueryWithHelpers } from 'mongoose';
import { Idea, IdeaDocument } from './schema/idea.schema';
import { VotesDocument } from './schema/votes.schema';
import { filter } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Flag } from '@src/common/enums/flag.enum';
import { CommentDocument } from './schema/comment.schema';
import * as paginate from 'mongoose-paginate-v2';
import Role from '@src/common/enums/role.enum';
export class IdeaService extends BaseService<IdeaDocument> {
    constructor(
        @InjectModel('Idea') private ideaModel: PaginateModel<IdeaDocument>,
        @InjectModel('Votes') private votesModel: PaginateModel<VotesDocument>,
        @InjectModel('Comment') private commentModel: PaginateModel<CommentDocument>,
        @InjectModel('Account') private accountModel: PaginateModel<Document>,
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




    // upvote
    async upvote(ideaId: string, voter: string) {
        let vote = await this.votesModel.findOne({ idea: new mongoose.Types.ObjectId(ideaId) });
        vote = await this._upvote(vote, voter);
        return vote;
    }

    // downvote
    async downvote(ideaId: string, voter: string) {
        let vote = await this.votesModel.findOne({ idea: new mongoose.Types.ObjectId(ideaId) });
        vote = await this._downvote(vote, voter);
        return vote;
    }


    

    async countVote(ideaId: string){
        const vote = await this.votesModel.findOne({ idea: new mongoose.Types.ObjectId(ideaId) });
        return vote.upvoter.length - vote.downvoter.length;
    }

    async checkVoted(ideaId: string, accountId: string) {
        const vote = await this.votesModel.findOne({ idea: new mongoose.Types.ObjectId(ideaId) });
        var status = "not voted";
        if (vote.upvoter.includes(accountId)) status = "upvoted";
        else if (vote.downvoter.includes(accountId)) status = "downvoted";
        return status;
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
            const paginateResults = await this.commentModel.paginate({ idea: new mongoose.Types.ObjectId(ideaId) }, options);
            const comments = paginateResults.docs;
            delete paginateResults.docs;
            return { data: comments, paginationOptions: paginateResults };
        }
        catch (error) {
            throw error;
        }
    }

    // comment
    async createComment(ideaId: string, comment: string, commenter: string) {
        try {
            const commentDoc = this.commentModel.create({ idea: new mongoose.Types.ObjectId(ideaId), content: comment, 
                author: new mongoose.Types.ObjectId(commenter), upvoters: [], downvoters: [] });
            return commentDoc;
        } catch (error) {
            throw error;
        }
    }

    // upvote comment
    async upvoteComment(commentId: string, voter: string) {
        let comment = await this.commentModel.findOne({ _id: new mongoose.Types.ObjectId(commentId) });
        comment = await this._upvote(comment, voter);
        return comment;
    }

    // downvote comment
    async downvoteComment(commentId: string, voter: string) {
        let comment = await this.commentModel.findOne({ _id: new mongoose.Types.ObjectId(commentId) });
        comment = await this._downvote(comment, voter);
        return comment;
    }

    async deleteComment(commentId: string) {
        try {
            return this.commentModel.deleteOne({ _id: new mongoose.Types.ObjectId(commentId) });
        } catch (error) {
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
   
    async _upvote(votable: any, voter: string) {
        try {
            let vote = votable;
            if (vote.upvoter.includes(voter)) {
                vote = await this._removeVote(vote, voter, "upvote");
            } else {
                if (vote.downvoter.includes(voter)) {
                    vote = await this._toggleVote(vote, voter, "downvote");
                } else {
                    vote = await this._addVote(vote, voter, "upvote");
                }
            }
            vote.save();
            return vote;
        } catch (error) {
            throw error;
        }
    }

    async _downvote(votable: any, voter: string) {
        try {
            let vote = votable;
            if (vote.downvoter.includes(voter)) {
                vote = await this._removeVote(vote, voter, "downvote");
            } else {
                if (vote.upvoter.includes(voter)) {
                    vote = await this._toggleVote(vote, voter, "upvote");
                } else {
                    await this._addVote(vote, voter, "downvote");
                }
            }
            vote.save();
            return vote;
        } catch (error) {
            throw error;
        }
    }

    // toggle upvote and downvote
    async _toggleVote(vote: any, voter: string, voteType: string) {
        try {
            if (voteType === "upvote") {
                vote = await this._removeVote(vote, voter, "upvote");
                vote.downvoter.push(voter);
            } else if (voteType === "downvote") {
                vote = await this._removeVote(vote, voter, "downvote");
                vote.upvoter.push(voter);
            } else {
                throw new Error("Invalid vote type");
            }
            return vote;
        } catch (error) {
            throw error;
        }

    }

    // remove upvote and downvote
    async _removeVote(vote: any, voter: string, voteType: string) {
        try {
            if (voteType === "upvote") {
                vote.upvoter.pull(voter);
            } else if (voteType === "downvote") {
                vote.downvoter.pull(voter);
            } else {
                throw new Error("Invalid vote type");
            }
            return vote;
        } catch (error) {
            throw error;
        }
    }

    async _addVote(vote: any, voter: string, voteType: string) {
        try {
            if (voteType === "upvote") {
                vote.upvoter.push(voter);

            } else if (voteType === "downvote") {
                vote.downvoter.push(voter);

            } else {
                throw new Error("Invalid vote type");
            }
            return vote;
        } catch (error) {
            throw error;
        }
    }


}