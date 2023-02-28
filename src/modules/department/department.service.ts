import { BaseService } from '../../common/service/base.service';
import { DepartmentDocument } from './schema/department.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
export class DepartmentService extends BaseService<DepartmentDocument> {
    constructor(@InjectModel('Department') private departmentModel: PaginateModel<DepartmentDocument>) {
        super(departmentModel);
    }
}