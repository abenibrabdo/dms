import type { NextFunction, Request, Response } from 'express';

import { AuthenticationError, AuthorizationError } from '@core/errors.js';
import { verifyAccessToken } from '@utils/jwt.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: string[];
    permissions?: string[];
  };
}

export const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError();
  }

  const token = authHeader.substring('Bearer '.length);
  const payload = verifyAccessToken(token);
  req.user = {
    id: payload.sub as string,
    roles: (payload.roles as string[]) ?? [],
    permissions: (payload.permissions as string[]) ?? [],
  };

  next();
};

export const authorize =
  (requiredRoles: string[] = [], requiredPermissions: string[] = []) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      throw new AuthenticationError();
    }

    const hasRole =
      requiredRoles.length === 0 || requiredRoles.some((role) => user.roles.includes(role));
    const hasPermission =
      requiredPermissions.length === 0 ||
      requiredPermissions.some((permission) => user.permissions?.includes(permission));

    if (!hasRole || !hasPermission) {
      throw new AuthorizationError();
    }

    next();
  };

