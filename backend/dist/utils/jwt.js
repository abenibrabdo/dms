import jwt from 'jsonwebtoken';
import { env } from '@config/index.js';
export const signAccessToken = (payload) => {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};
export const signRefreshToken = (payload) => {
    return jwt.sign(payload, env.refreshSecret, { expiresIn: env.refreshExpiresIn });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, env.jwtSecret);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, env.refreshSecret);
};
