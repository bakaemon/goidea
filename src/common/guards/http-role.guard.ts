import Role from "@common/enums/role.enum";

import { AuthGuard } from "@common/guards/auth.guard";
import { CanActivate, ExecutionContext, Res, Type, mixin } from "@nestjs/common";
import { HttpAuthGuard } from "./http-auth.guard";
import { getTokenFromCookies } from "../util/get-token-from-request";
import { AuthService } from "@src/modules/auth/auth.service";
import { Response } from "express";
import configs from "@src/configs";


const HttpRoleGuard = (...role: Role[]): Type<CanActivate> => {
    class RoleGuardMixin extends HttpAuthGuard {
        
        constructor(private auth: AuthService) { super(auth); }
        async canActivate(context: ExecutionContext) {
            await super.canActivate(context);

            const request = context.switchToHttp().getRequest();
            const res = context.switchToHttp().getResponse() as Response;
            const ctx = context.switchToHttp();
            const account = request.account;
            // check if account has at least one correct role
            
            if (account?.roles.some(r => role.includes(r))) {
                return true;
            }
            // eslint-disable-next-line prefer-const
            let { token, refreshToken } = getTokenFromCookies(request);

            if (!refreshToken) {
                // redirect to login page
                res.redirect('/login');
                return false;
            }
            if (!token && refreshToken) {
                // send refresh token to server
                token = (await this.auth.refreshToken(refreshToken)).access_token;
                res.cookie('token', token, { httpOnly: false, maxAge:  1000 * 60 * 30});
                // redirect to intended page
                res.redirect(request.originalUrl);
                return false;
            }
            return true;

        }
    }

    return mixin(RoleGuardMixin);
};

export default HttpRoleGuard;