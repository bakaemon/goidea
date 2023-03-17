import Role from "@common/enums/role.enum";

import { AuthGuard } from "@common/guards/auth.guard";
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Res, Type, mixin } from "@nestjs/common";
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
            const response = context.switchToHttp().getResponse<Response>();
            const account = request.account;
            if (!account) {
                response.redirect("/login");
                return false;
            }
            // check if account has at least one correct role
            if (role.length == 0) return true;
            const roles = account.roles ?? [];
            if (roles.includes(Role.Admin)) return true;
            if (!roles) throw new HttpException("The account has no role!", HttpStatus.FORBIDDEN);
            if (role.length > 1) {
                return role.some(r => roles.includes(r));
            } else return roles.includes(role[0]);

        }
    }

    return mixin(RoleGuardMixin);
};

export default HttpRoleGuard;