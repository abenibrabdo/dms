import { AuthenticationError, AppError } from '@core/errors.js';
import { logger } from '@core/logger.js';
import { hashPassword, verifyPassword } from '@utils/password.js';
import { signAccessToken, signRefreshToken } from '@utils/jwt.js';
import { UserModel } from './auth.model.js';
const normalizeEmail = (email) => email.trim().toLowerCase();
export const registerUser = async (input) => {
    const email = normalizeEmail(input.email);
    const existing = await UserModel.findOne({ where: { email } });
    if (existing) {
        throw new AppError('Email already registered', 409);
    }
    const hashedPassword = await hashPassword(input.password);
    const user = await UserModel.create({
        ...input,
        email,
        password: hashedPassword,
        roles: input.roles ?? ['user'],
        permissions: input.permissions ?? [],
    });
    logger.info({ userId: user.id }, 'User registered');
    return user.get({ plain: true });
};
export const authenticateUser = async (input) => {
    const email = normalizeEmail(input.email);
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
        throw new AuthenticationError('Invalid credentials');
    }
    const isPasswordValid = await verifyPassword(input.password, user.password);
    if (!isPasswordValid) {
        throw new AuthenticationError('Invalid credentials');
    }
    const accessToken = signAccessToken({
        sub: user.id,
        roles: user.roles,
        permissions: user.permissions,
    });
    const refreshToken = signRefreshToken({ sub: user.id });
    return {
        user: user.get({ plain: true }),
        tokens: { accessToken, refreshToken },
    };
};
export const listUsers = async () => {
    const users = await UserModel.findAll({
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']],
    });
    return users.map((user) => user.get({ plain: true }));
};
