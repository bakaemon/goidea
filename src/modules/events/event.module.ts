import { Module } from "@nestjs/common";
import { EventAPIController } from "./event.api.controller";
import { EventController } from "./event.controller";
import { EventService } from './event.service';
import { RouterModule } from "@nestjs/core";
import { DatabaseModule } from "@src/common/database_module/database.module";

@Module({
    controllers: [EventAPIController, EventAPIController, EventController],
    providers: [EventService],
    exports: [],
    imports: [DatabaseModule,
        RouterModule.register([
            {
                path: 'event',
                module: EventModule,
            },
        ])]
    
})
export class EventModule {}