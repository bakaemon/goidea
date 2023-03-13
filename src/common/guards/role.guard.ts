import Role from "@common/enums/role.enum";

import { AuthGuard } from "@common/guards/auth.guard";
import { CanActivate, ExecutionContext, Type, mixin } from "@nestjs/common";


const RoleGuard = (...role): Type<CanActivate> => {   
    class RoleGuardMixin extends AuthGuard {
        async canActivate(context: ExecutionContext) {
            await super.canActivate(context);
            const request = context.switchToHttp().getRequest();
            const roles: string[] = request.account!.roles ?? [];
            if (role.length > 1) {
                return role.some(r => roles.includes(r));
            }

            return roles.includes(role[0]);
        }
    }

    return mixin(RoleGuardMixin);
};


export default RoleGuard;