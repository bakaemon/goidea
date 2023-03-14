import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Res } from "@nestjs/common";
import { AuthService } from "@modules/auth/auth.service";
import { getTokenFromRequest } from "@util/get-token-from-request";
import { getTokenFromCookies } from '../util/get-token-from-request';
import { TokensService } from "@src/modules/token/token.service";


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
        const res = ctx.getResponse();
        // eslint-disable-next-line prefer-const
        let {token, refreshToken} = getTokenFromCookies(req);

        if (!refreshToken) {
            // redirect to login page
            ctx.getResponse().redirect('/login');
        }
        if (!token && refreshToken) {
            // send refresh token to server
            token = (await this.authService.refreshToken(refreshToken)).access_token;
            res.cookie('token', token, { httpOnly: false, maxAge: 1000 * 60 * 30 });
            // redirect to current page
            res.redirect(req.originalUrl);
        }
        const tokenRes = await this.authService.verifyTokenFromRequest(token, "jwt.accessTokenPrivateKey");

        req.account = tokenRes;
        return true;
    }
}
