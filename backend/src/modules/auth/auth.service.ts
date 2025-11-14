import { AuthenticationError, AppError } from '@core/errors.js';
import { logger } from '@core/logger.js';
import { hashPassword, verifyPassword } from '@utils/password.js';
import { decrypt } from '@utils/crypto.js';
import { encrypt } from '@utils/crypto.js';
import { authenticator } from 'otplib';
import { signAccessToken, signRefreshToken } from '@utils/jwt.js';

import { UserModel, type UserAttributes } from './auth.model.js';
import { PasswordResetModel } from './password-reset.model.js';
import { randomUUID } from 'node:crypto';
import type { CreateUserInput, LoginInput } from './auth.types.js';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const registerUser = async (input: CreateUserInput): Promise<UserAttributes> => {
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

export const authenticateUser = async (input: LoginInput) => {
  const email = normalizeEmail(input.email);
  const user = await UserModel.findOne({ where: { email } });
  if (!user) {
    throw new AuthenticationError('Invalid credentials');
  }

  const isPasswordValid = await verifyPassword(input.password, user.password);
  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid credentials');
  }

  if (user.isMfaEnabled) {
    const secretEnc = user.mfaSecretEnc;
    if (!secretEnc) {
      throw new AuthenticationError('MFA not configured');
    }
    const secret = decrypt(secretEnc);
    const token = input.mfaCode?.toString();
    if (!token || !authenticator.check(token, secret)) {
      throw new AuthenticationError('MFA required or invalid');
    }
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

export const setupMfa = async (userId: string) => {
  const user = await UserModel.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  const secret = authenticator.generateSecret();
  user.mfaSecretEnc = encrypt(secret);
  user.isMfaEnabled = false;
  user.mfaRecoveryCodes = Array.from({ length: 10 }).map(() =>
    Math.random().toString(36).slice(2, 10),
  );
  await user.save();
  const otpauth = authenticator.keyuri(user.email, 'DMS', secret);
  return { otpauth };
};

export const verifyMfa = async (userId: string, code: string) => {
  const user = await UserModel.findByPk(userId);
  if (!user || !user.mfaSecretEnc) {
    throw new AppError('MFA not configured', 400);
  }
  const secret = decrypt(user.mfaSecretEnc);
  if (!authenticator.check(code, secret)) {
    throw new AuthenticationError('Invalid MFA code');
  }
  user.isMfaEnabled = true;
  await user.save();
  return { recoveryCodes: user.mfaRecoveryCodes };
};

export const disableMfa = async (userId: string) => {
  const user = await UserModel.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  user.isMfaEnabled = false;
  user.mfaSecretEnc = null;
  user.mfaRecoveryCodes = [];
  await user.save();
  return { success: true };
};

export const requestPasswordReset = async (email: string) => {
  const user = await UserModel.findOne({ where: { email: email.trim().toLowerCase() } });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  const token = randomUUID().replace(/-/g, '');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await PasswordResetModel.create({ userId: user.id, token, expiresAt, used: false });
  logger.info({ userId: user.id }, 'Password reset requested');
  return { token, expiresAt };
};

export const confirmPasswordReset = async (token: string, newPassword: string) => {
  const reset = await PasswordResetModel.findOne({ where: { token } });
  if (!reset || reset.used || reset.expiresAt < new Date()) {
    throw new AppError('Invalid or expired reset token', 400);
  }
  const user = await UserModel.findByPk(reset.userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  user.password = await hashPassword(newPassword);
  await user.save();
  reset.used = true;
  await reset.save();
  logger.info({ userId: user.id }, 'Password reset confirmed');
  return { success: true };
};

export const listUsers = async () => {
  const users = await UserModel.findAll({
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
  });

  return users.map((user) => user.get({ plain: true }));
};

