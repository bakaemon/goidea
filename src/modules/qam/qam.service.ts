import { Injectable } from '@nestjs/common';

@Injectable()
export class QamService {
    getHello(): string {
        return 'Hello!';
    }
}