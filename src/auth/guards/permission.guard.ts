import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEYS } from 'src/permissions/permission.decorator';
import { Permission } from 'src/permissions/permission.enum';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class PermissionAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEYS,
      [context.getClass(), context.getHandler()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roles)
      throw new UnauthorizedException('User not authenticated!');

    const hasPermission: boolean = await this.checkPermission(
      user,
      requiredPermissions,
    );

    if (!hasPermission)
      throw new ForbiddenException('Insufficient permissions!');

    return hasPermission;
  }

  private readonly checkPermission = async (
    user: any,
    requiredPermissions: Permission[],
  ): Promise<boolean> => {
    for (const role of user.roles) {
      const rolePermissions =
        await this.roleService.findAllPermissionByRoleName(role);

      const permissions = rolePermissions.permissions.map(
        (permission) => permission.name,
      );

      for (const permission of requiredPermissions) {
        if (permissions.includes(permission)) {
          return true;
        }
      }
    }

    return false;
  };
}
