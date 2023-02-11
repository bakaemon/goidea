import { Controller, Get, Render } from '@nestjs/common';
import { CreateUsersService } from '../../services/features/CreateUsers.service';

@Controller()
export class CreateUsersController {
    constructor(private readonly appService: CreateUsersService) {}
    
    @Get()
    @Render('CreateUsers_index')
    root() {
        return { };
    }
    }