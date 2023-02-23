import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module ({
    imports: [RouterModule.register([
        {
            path: 'staff',
            module: StaffModule,
        }
    ])],
    controllers: [StaffController],
    providers: [StaffService],
})
export class StaffModule {}