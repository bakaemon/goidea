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
        let {token, refreshToken} = getTokenFromRequest(req);

        if (!token) {
            token = (await this.authService.refreshToken(refreshToken)).access_token;
            res.cookie('token', token, { httpOnly: false, maxAge:  1000 * 60 * 30});
            // redirect to intended page
            res.redirect(req.originalUrl);
        }
        
        const tokenRes = await this.authService.verifyTokenFromRequest(token, "jwt.accessTokenPrivateKey");

        if (!tokenRes) {
            token = (await this.authService.refreshToken(refreshToken)).access_token;
            res.cookie('token', token, { httpOnly: false, maxAge:  1000 * 60 * 30});
            // redirect to intended page
            res.redirect(req.originalUrl);
        }

        if (!refreshToken) {
            res.redirect("/login");
            return false;
        }

        if (!(await this.authService.verifyToken(refreshToken, "jwt.refreshTokenPrivateKey"))) {
            res.redirect("/login");
            return false;
        }

        req.account = tokenRes;

        return true;
    }
}
