import { BaseService } from '../../common/service/base.service';
import { Event, EventDocument } from './schema/event.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, FilterQuery, PaginateModel, PaginateOptions, QueryOptions, Types } from 'mongoose';
import { IdeaDocument } from '../ideas/schema/idea.schema';
import * as paginate from 'mongoose-paginate-v2';
export class EventService extends BaseService<EventDocument> {
    constructor(
        @InjectModel('Event') private eventModel: PaginateModel<EventDocument>,
        @InjectModel('Idea') private ideaModel: PaginateModel<IdeaDocument>,
        ) {
        super(eventModel);

    }


    // get all paginated and populated
    async find(filter: FilterQuery<EventDocument>){
        let query = await this.eventModel.paginate(filter, {
            populate: [
                { path: 'department' },
                { path: 'category' },
                { path: 'author' },
            ]
        });
        const events = query.docs;
        delete query.docs;
        return { data: events, paginationOptions: query };
    }

    async findOne(filter: FilterQuery<EventDocument>){
        let event = await this.eventModel.findOne(filter).populate([
            { path: 'department' },
            { path: 'category' },
            { path: 'author' },
        ]);
        return event;
    }

    //get ideas by event id
    async findIdeasByEventId(id: string){
        let results = await this.ideaModel.paginate({ event: new Types.ObjectId(id) }, {
            populate: [
                { path: 'title' },
                { path: 'description' },
                { path: 'author' },
            ]
        });
        var idea = results.docs;
        delete results.docs;
        return { data: idea, paginationOptions: results};
    }
    
}