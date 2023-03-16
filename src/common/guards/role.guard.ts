import Role from "@common/enums/role.enum";

import { AuthGuard } from "@common/guards/auth.guard";
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Type, mixin } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';


const RoleGuard = (...role: string[]): Type<CanActivate> => {   
    class RoleGuardMixin extends AuthGuard {
        async canActivate(context: ExecutionContext) {
            await super.canActivate(context);
            if (role.length == 0) return true;
            const request = context.switchToHttp().getRequest();
            const roles: string[] = request.account!.roles ?? [];
            if (roles.includes(Role.Admin)) return true;
            if (!roles) throw new HttpException("The account has no role!", HttpStatus.FORBIDDEN);
            if (role.length > 1) {
                return role.some(r => roles.includes(r));
            } else return role.includes(roles[0]);
        }
    }

    return mixin(RoleGuardMixin);
};


export default RoleGuard;