import { Module } from '@nestjs/common';
import { CreateUsersService } from 'src/services/features/CreateUsers.service';
import { CreateUsersController } from '../../controllers/features/CreateUsers.controller';

@Module({
    imports: [],
    controllers: [CreateUsersController],
    providers: [CreateUsersService],
})
export class CreateUsersModule {}