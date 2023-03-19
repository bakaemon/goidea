import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { MainController} from './main.controller';


@Module ({
    imports: [RouterModule.register([
        {
            path: '/home',
            module: MainModule,
        }
    ])],
    controllers: [MainController],
})
export class MainModule {}