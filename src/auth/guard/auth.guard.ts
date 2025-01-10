import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { RolesGuard } from '@src/auth/guard/role.guard';
import { Role } from '@src/auth/role/role.enum';

export function Auth(...roles: Role[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(RolesGuard));
}
