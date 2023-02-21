import { Catch, UnauthorizedException, ExceptionFilter, HttpException, ArgumentsHost } from "@nestjs/common";
import { Response } from "express";

@Catch(UnauthorizedException)
export class HttpAuthFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        response.status(status).redirect('/login');
    }
}