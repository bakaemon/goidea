import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { DatabaseModule } from "@src/common/database_module/database.module";
import { CategoryAPIController } from "./category.api.controller";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
    controllers: [CategoryAPIController, CategoryController],
    providers: [CategoryService],
    exports: [],
    imports: [DatabaseModule,
        RouterModule.register([
            {
                path: 'category',
                module: CategoryModule,
            },
        ])]
})
export class CategoryModule { }