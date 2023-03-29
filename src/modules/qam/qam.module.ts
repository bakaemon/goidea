import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { QamController } from './qam.controller';
import { QamService } from './qam.service';

@Module({
    imports: [RouterModule.register([
        {
            path: 'qam',
            module: QamModule,
        }
    ])],
    controllers: [QamController],
    providers: [QamService],
})
export class QamModule {}