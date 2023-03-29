import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthService } from "@modules/auth/auth.service";
import { getTokenFromRequest } from "@util/get-token-from-request";


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService
    ) {
    }

    async canActivate(
        context: ExecutionContext
    ) {

        const ctx = context.switchToHttp();
        const req = ctx.getRequest();
        const {token, refreshToken} = getTokenFromRequest(req);

        if (!token) {
            throw new HttpException("Unauthorized: Empty token.", HttpStatus.UNAUTHORIZED);
        }
        
        const tokenRes = await this.authService.verifyTokenFromRequest(token, "jwt.accessTokenPrivateKey");

        if (!tokenRes) {
            throw new HttpException("Unauthorized: Invalid token.", HttpStatus.UNAUTHORIZED);
        }

        if (!refreshToken) {
            throw new HttpException("Unauthorized: Empty refresh token.", HttpStatus.UNAUTHORIZED);
        }

        if (!(await this.authService.verifyToken(refreshToken, "jwt.refreshTokenPrivateKey"))) {
            throw new HttpException("Unauthorized: Invalid refresh token.", HttpStatus.UNAUTHORIZED);
        }

        req.account = tokenRes;

        return true;
    }
}
