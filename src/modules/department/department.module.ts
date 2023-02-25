import { Module } from "@nestjs/common";
import { DepartmentController } from "./department.controller";
import { DepartmentAPIController } from "./department.api.controller";
import { DepartmentService } from './department.service';
import { RouterModule } from "@nestjs/core";
import { DatabaseModule } from "@src/common/database_module/database.module";

@Module({
    controllers: [DepartmentController, DepartmentAPIController],
    providers: [DepartmentService],
    exports: [],
    imports: [DatabaseModule,
        RouterModule.register([
            {
                path: 'department',
                module: DepartmentModule,
            },
        ])]
})
export class DepartmentModule {}