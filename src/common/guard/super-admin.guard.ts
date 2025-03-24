import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AdminRoles } from '../enum';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.user?.role || req.user?.role !== AdminRoles.SUPERADMIN) {
      throw new ForbiddenException('Forbidden user');
    }
    return true;
  }
}
