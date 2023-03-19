import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Res, UnauthorizedException } from '@nestjs/common';
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

        if(!refreshToken) {
            throw new UnauthorizedException("Refresh token not found");
        }
        if (!token) {
            token = (await this. authService.refreshToken(refreshToken)).access_token;
            res.cookie('token', token, { httpOnly: false, maxAge:  1000 * 60 * 30});
            // redirect to intended page
            res.redirect(req.originalUrl);
            return false;
        }
        let tokenRes;
        try {
            tokenRes = await this.authService.verifyTokenFromRequest(token, "jwt.accessTokenPrivateKey");

        if (!tokenRes) {
            token = (await this.authService.refreshToken(refreshToken)).access_token;
            res.cookie('token', token, { httpOnly: false, maxAge:  1000 * 60 * 30});
            // redirect to intended page
            throw new UnauthorizedException("Refresh token not found");
        }
        } catch(e) {
            console.log(e.message);
            token = (await this.authService.refreshToken(refreshToken)).access_token;
            throw new UnauthorizedException("Refresh token not found");
        }


        if (!refreshToken) {
            throw new UnauthorizedException("Refresh token not found");
        }

        if (!(await this.authService.verifyToken(refreshToken, "jwt.refreshTokenPrivateKey"))) {
            throw new UnauthorizedException("Refresh token not found");
        }

        req.account = tokenRes;

        return true;
    }
}
