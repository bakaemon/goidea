import { BaseService } from '../../common/service/base.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, FilterQuery, QueryOptions } from 'mongoose';
import { IdeaDocument } from './schema/idea.schema';
import { VotesDocument } from './schema/votes.schema';
import { filter } from 'rxjs';
export class IdeaService {
    constructor(
        @InjectModel('Idea') private ideaModel: PaginateModel<IdeaDocument>,
        @InjectModel('Votes') private votesModel: PaginateModel<VotesDocument>,
    ) {
    }

    async upvote(ideaId: string, voter: string) {
        const vote = await this.votesModel.findOne({ idea: ideaId, upvoter: voter });
        if (vote) {
            this.removeVote(ideaId, voter, "upvote");
        } else {
            vote.upvoter.push(voter);
            await vote.save();
        }
    }

    async downvote(ideaId: string, voter: string) {
        const vote = await this.votesModel.findOne({ idea: ideaId, downvoter: voter });
        if (vote) {
            this.removeVote(ideaId, voter, "downvote");
        } else {
            vote.downvoter.push(voter);
            await vote.save();
        }
    }
    // removeVote(id: string, voter: string) {
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

    async create(idea : any) {
        try {
            const newIdea = new this.ideaModel(idea);
            return await newIdea.save();
        } catch (error) {
            throw error;
        }
    }

    async findOne(filter: FilterQuery<IdeaDocument>, options?: QueryOptions) {
    }

    async update(filter: FilterQuery<IdeaDocument>, update: any, options?: QueryOptions) {
    }

    async delete(filter: FilterQuery<IdeaDocument>, options?: QueryOptions) {
    }

    async paginate(filter: FilterQuery<IdeaDocument>, options?: QueryOptions) {
    }

    async findAll(filter: FilterQuery<IdeaDocument>, options?: QueryOptions) {
    }

    async aggregate(filter: FilterQuery<IdeaDocument>, pipeline: any[], options?: QueryOptions) {
    }

    async count(filter: FilterQuery<IdeaDocument>, options?: QueryOptions) {
    }



}