import { Module } from '@nestjs/common';
import { UserService } from 'src/services/features/user.service';
import { UserController } from '../../controllers/features/users.controller';

@Module ({
    imports: [],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}