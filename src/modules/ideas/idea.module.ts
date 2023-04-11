import { Module, forwardRef } from "@nestjs/common";
import { IdeaController } from './idea.controller';
import { IdeaAPIController } from './idea.api.controller';
import { IdeaService } from './idea.service';
import { DatabaseModule } from "@src/common/database_module/database.module";
import { RouterModule } from "@nestjs/core";
import { TagService } from '../tag/tag.service';
import { CategoryService } from "../category/category.service";
import { EventService } from "../events/event.service";
import { EmailTransporter } from "@src/common/email/email-transporter";
import { AccountsService } from "../accounts/accounts.service";


@Module({
    imports: [DatabaseModule, RouterModule.register([
        {
            path: 'ideas',
            module: IdeaModule,
        },
    ]),
    ],
    controllers: [IdeaController, IdeaAPIController],
    providers: [IdeaService, TagService, CategoryService, EventService,EmailTransporter, AccountsService],
    exports: []
})
export class IdeaModule { }