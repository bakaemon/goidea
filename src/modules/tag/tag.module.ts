import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { DatabaseModule } from "@src/common/database_module/database.module";
import { TagAPIController } from "./tag.api.controller";
import { TagService } from "./tag.service";

@Module({
    controllers: [TagAPIController],
    providers: [TagService],
    exports: [TagService],
    imports: [DatabaseModule,
        RouterModule.register([
            {
                path: 'tag',
                module: TagModule,
            },
        ])]
})
export class TagModule { }