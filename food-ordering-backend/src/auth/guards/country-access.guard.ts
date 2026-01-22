import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/enums/role.enum';
import { COUNTRY_ACCESS_KEY } from '../decorators/country-access.decorator';

@Injectable()
export class CountryAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireCountryAccess = this.reflector.getAllAndOverride<boolean>(
      COUNTRY_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requireCountryAccess) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Admin can access all countries
    if (user.role === Role.ADMIN) {
      return true;
    }

    // For other roles, check if resource country matches user country
    const resourceCountry = request.body?.country || request.params?.country || request.query?.country;
    
    if (resourceCountry && resourceCountry !== user.country) {
      throw new ForbiddenException('Cannot access resources from different country');
    }

    return true;
  }
}