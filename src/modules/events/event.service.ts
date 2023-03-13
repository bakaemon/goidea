import { BaseService } from '../../common/service/base.service';
import { EventDocument } from './schema/event.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
export class EventService extends BaseService<EventDocument> {
    constructor(@InjectModel('Event') private eventModel: PaginateModel<EventDocument>) {
        super(eventModel);
    }
}