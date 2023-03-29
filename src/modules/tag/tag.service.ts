import { BaseService } from '../../common/service/base.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { TagDocument } from './schema/tag.schema';
export class TagService extends BaseService<TagDocument> {
    constructor(@InjectModel('Tag') private tagModel: PaginateModel<TagDocument>) {
        super(tagModel);
    }
}