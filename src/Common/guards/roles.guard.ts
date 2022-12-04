import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || !roles.length) {
      return false
    }
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    if (!req.user) {
      return false;
    }
    const hasRole = () => roles.includes(req.user.roles);
    return req.user && req.user.roles && hasRole();
  }
}

