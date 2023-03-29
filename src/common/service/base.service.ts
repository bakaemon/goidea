import {
    FilterQuery,
    PaginateModel,
    PaginateOptions,
    QueryOptions,
    Document, HydratedDocument, UnpackedIntersection, QueryWithHelpers, UpdateQuery, PipelineStage, Aggregate
} from "mongoose";
import { HttpException } from "@nestjs/common";
import { filter } from "rxjs";
import * as mongoose from "mongoose";

export class BaseService<T extends Document> {
    constructor(private model: PaginateModel<T>) {
    }

    async create(createDocumentDto: any, options?: QueryOptions): Promise<HydratedDocument<T, {}, {}>> {
        const document = await this.model.create(createDocumentDto);
        if (options?.populate) await document.populate(options?.populate);
        return document;
    }

    async findAll(filter: FilterQuery<T>, options?: PaginateOptions): Promise<PaginatedDocumentsResponse<T>> {
        const paginateResult = await this.model.paginate(filter, options);
        const data = paginateResult.docs;
        delete paginateResult.docs;
        return {
            data,
            paginationOptions: paginateResult
        };
    }

    async aggregate(filter: FilterQuery<T>, pipeline: PipelineStage[] = [], options?: PaginateOptions): Promise<Aggregate<Array<T>>> {
        Object.keys(filter).forEach(data => {
            if (mongoose.isValidObjectId(filter[data])) Object.assign(filter, { [data]: new mongoose.Types.ObjectId(filter[data]) });
        });

        return this.model.aggregate([{
            $match: filter
        }, ...pipeline, {
            $sort: { _id: -1 }
        }, {
            $limit: options?.limit || 9
        }, {
            $skip: options?.limit * options?.page || 0
        }]
        );
    }

    async findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<UnpackedIntersection<HydratedDocument<T, {}, {}>, {}>> {
        const document = await this.model.findOne(filter, null, options).populate(options?.populate).select(options?.select);
        if (options?.nullable !== true && !document) throw new HttpException(`${this.model.modelName} not found`, 500);

        return document;
    }

    async update(filter: FilterQuery<T>, updateDocumentDto: UpdateQuery<T>, options?: QueryOptions): Promise<UnpackedIntersection<HydratedDocument<T, {}, {}>, {}>> {
        const document = await this.model.findOneAndUpdate(filter, updateDocumentDto, options).populate(options?.populate);
        if (options?.nullable !== true && !document) throw new HttpException(`${this.model.modelName} not found`, 500);

        return document;
    }

    async delete(filter: FilterQuery<T>, options?: QueryOptions): Promise<UnpackedIntersection<HydratedDocument<T, {}, {}>, {}>> {
        const document = await this.model.findOneAndDelete(filter, options).populate(options?.populate);
        if (options?.nullable !== true && !document) throw new HttpException(`${this.model.modelName} not found`, 500);

        return document;
    }


    async deleteMany(filter: FilterQuery<T>, options?: QueryOptions) {
        const result = await this.model.deleteMany(filter, options).populate(options?.populate);

        return result;
    }

    count(filter: FilterQuery<T>): QueryWithHelpers<number, HydratedDocument<T, {}, {}>, {}, T> {
        return this.model.countDocuments(filter);
    }
}
