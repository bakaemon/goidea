import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { QacController } from './qac.controller';
import { QacService } from './qac.service';

@Module({
    imports: [RouterModule.register([
        {
            path: 'qac',
            module: QacModule,
        }
    ])],
    controllers: [QacController],
    providers: [QacService],
})
export class QacModule {}