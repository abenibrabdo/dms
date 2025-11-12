import jwt from 'jsonwebtoken';

import { env } from '@config/index.js';

type JwtPayload = Record<string, unknown>;

export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.refreshSecret, { expiresIn: env.refreshExpiresIn });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.refreshSecret) as JwtPayload;
};

