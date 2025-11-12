import { AuthenticationError, AppError } from '@core/errors.js';
import { logger } from '@core/logger.js';
import { hashPassword, verifyPassword } from '@utils/password.js';
import { signAccessToken, signRefreshToken } from '@utils/jwt.js';

import { UserModel, type UserDocument } from './auth.model.js';
import type { CreateUserInput, LoginInput } from './auth.types.js';

export const registerUser = async (input: CreateUserInput): Promise<UserDocument> => {
  const existing = await UserModel.findOne({ email: input.email });
  if (existing) {
    throw new AppError('Email already registered', 409);
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await UserModel.create({
    ...input,
    password: hashedPassword,
    roles: input.roles ?? ['user'],
    permissions: input.permissions ?? [],
  });

  logger.info({ userId: user.id }, 'User registered');
  return user;
};

export const authenticateUser = async (input: LoginInput) => {
  const user = await UserModel.findOne({ email: input.email });
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
    user,
    tokens: { accessToken, refreshToken },
  };
};

export const listUsers = async () => {
  return UserModel.find().select('-password').lean();
};

