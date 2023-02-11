import { Module } from '@nestjs/common';
import { AdminService } from 'src/services/roles/admin.service';
import { AdminController } from '../../controllers/roles/admin.controller';

@Module ({
    imports: [],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule {}