import { AuthenticationError, AuthorizationError } from '@core/errors.js';
import { verifyAccessToken } from '@utils/jwt.js';
export const authenticate = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        throw new AuthenticationError();
    }
    const token = authHeader.substring('Bearer '.length);
    const payload = verifyAccessToken(token);
    req.user = {
        id: payload.sub,
        roles: payload.roles ?? [],
        permissions: payload.permissions ?? [],
    };
    next();
};
export const authorize = (requiredRoles = [], requiredPermissions = []) => (req, _res, next) => {
    const user = req.user;
    if (!user) {
        throw new AuthenticationError();
    }
    const hasRole = requiredRoles.length === 0 || requiredRoles.some((role) => user.roles.includes(role));
    const hasPermission = requiredPermissions.length === 0 ||
        requiredPermissions.some((permission) => user.permissions?.includes(permission));
    if (!hasRole || !hasPermission) {
        throw new AuthorizationError();
    }
    next();
};
