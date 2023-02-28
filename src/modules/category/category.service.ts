import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "@src/common/service/base.service";
import { PaginateModel } from "mongoose";
import { CategoryDocument } from "./schema/category.schema";

export class CategoryService extends BaseService<CategoryDocument> {
    constructor(@InjectModel("Category") private categoryModel: PaginateModel<CategoryDocument>) {
        super(categoryModel);
    }
}