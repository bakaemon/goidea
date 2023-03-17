import { Injectable } from '@nestjs/common';

@Injectable()
export class QacService {
    getHello(): string {
        return 'Hello!';
    }
}