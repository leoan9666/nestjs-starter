import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '@src/auth/role/role.enum';
import { ROLES_KEY } from '@src/auth/role/roles.decorator';
import { CacheService } from '@src/cache/cache.service';
import { TCacheService } from '@src/cache/cache.type';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly cache: TCacheService;

  constructor(
    private readonly reflector: Reflector,
    private readonly cacheService: CacheService,
  ) {
    this.cache = this.cacheService.createCacheService();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { session } = context.switchToHttp().getRequest();
    const userID = await this.cache.get(`sessionID:${session.user.sessionID}`);
    const userData = (await this.cache.get(`userID:${userID}`)) || '';
    const parseUserData = JSON.parse(userData);
    const roles = parseUserData.roles;

    if (!requiredRoles.some((role) => roles?.includes(role))) {
      throw new UnauthorizedException(
        'You do not have the necessary permissions to access this resource',
      );
    }

    return requiredRoles.some((role) => roles?.includes(role));
  }
}
