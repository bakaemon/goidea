import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthService } from "@modules/auth/auth.service";
import { getTokenFromRequest } from "@util/get-token-from-request";
import { getTokenFromCookies } from '../util/get-token-from-request';


@Injectable()
export class HttpAuthGuard implements CanActivate {

    constructor(
        private authService: AuthService
    ) {
    }

    async canActivate(
        context: ExecutionContext
    ) {

        const ctx = context.switchToHttp();
        const req = ctx.getRequest();
        const token = getTokenFromCookies(req);

        if (!token) {
            // redirect to login page
            ctx.getResponse().redirect('/login');
        }

        const tokenRes = await this.authService.verifyTokenFromRequest(token, "jwt.accessTokenPrivateKey");

        req.account = tokenRes;
        return true;
    }
}
