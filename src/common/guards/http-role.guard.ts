import Role from "@common/enums/role.enum";

import { AuthGuard } from "@common/guards/auth.guard";
import { CanActivate, ExecutionContext, Type, mixin } from "@nestjs/common";
import { HttpAuthGuard } from "./http-auth.guard";


const HttpRoleGuard = (role: Role): Type<CanActivate> => {
    class RoleGuardMixin extends HttpAuthGuard {
        async canActivate(context: ExecutionContext) {
            await super.canActivate(context);

            const request = context.switchToHttp().getRequest();
            const account = request.account;

            if (account?.roles.includes(role)) {
                return true;
            }
            else {
                context.switchToHttp().getResponse().redirect('/login');
                return false;
            }
        }
    }

    return mixin(RoleGuardMixin);
};

export default HttpRoleGuard;