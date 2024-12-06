import { SetMetadata } from '@nestjs/common';
import { Permission } from 'src/permissions/permission.enum';

export const PERMISSIONS_KEYS = 'permissions';
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEYS, permissions);
