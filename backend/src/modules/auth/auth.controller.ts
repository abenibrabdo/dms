import type { Response } from 'express';

import type { AuthenticatedRequest } from '@middlewares/auth.js';

import type { CreateUserInput, LoginInput, MfaVerifyInput } from './auth.types.js';
import { authenticateUser, listUsers, registerUser, setupMfa, verifyMfa, disableMfa, requestPasswordReset, confirmPasswordReset } from './auth.service.js';
import { listAccessControls, replaceAccessControls } from './access-control.service.js';
import type { ConfirmPasswordResetInput, RequestPasswordResetInput } from './auth.types.js';
import { env } from '@config/index.js';
import { AuthenticationError } from '@core/errors.js';
import { isDeniedByAccessControls } from './access-control.service.js';

export const registerHandler = async (req: AuthenticatedRequest, res: Response) => {
  const payload = req.body as CreateUserInput;
  const user = await registerUser(payload);

  res.status(201).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
    },
  });
};

export const loginHandler = async (req: AuthenticatedRequest, res: Response) => {
  const payload = req.body as LoginInput;
  const ip = (req.headers['x-forwarded-for']?.toString().split(',')[0] ?? req.ip ?? '').trim();
  const deviceId = req.headers['x-device-id']?.toString();

  if (env.accessControls.blockedIps.length && ip && env.accessControls.blockedIps.includes(ip)) {
    throw new AuthenticationError('Access blocked from IP');
  }
  if (env.accessControls.allowedIps.length && ip && !env.accessControls.allowedIps.includes(ip)) {
    throw new AuthenticationError('IP not allowed');
  }
  if (env.accessControls.allowedDeviceIds.length && (!deviceId || !env.accessControls.allowedDeviceIds.includes(deviceId))) {
    throw new AuthenticationError('Device not allowed');
  }
  if (await isDeniedByAccessControls(ip, deviceId)) {
    throw new AuthenticationError('Access denied by policy');
  }
  const result = await authenticateUser(payload);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        roles: result.user.roles,
        permissions: result.user.permissions,
      },
      tokens: result.tokens,
    },
  });
};

export const listUsersHandler = async (_req: AuthenticatedRequest, res: Response) => {
  const users = await listUsers();
  res.status(200).json({
    success: true,
    data: users,
  });
};

export const mfaSetupHandler = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const result = await setupMfa(userId ?? '');
  res.status(200).json({ success: true, data: result });
};

export const mfaVerifyHandler = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id ?? '';
  const payload = req.body as MfaVerifyInput;
  const result = await verifyMfa(userId, payload.code);
  res.status(200).json({ success: true, data: result });
};

export const mfaDisableHandler = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id ?? '';
  const result = await disableMfa(userId);
  res.status(200).json({ success: true, data: result });
};

export const requestPasswordResetHandler = async (req: AuthenticatedRequest, res: Response) => {
  const payload = req.body as RequestPasswordResetInput;
  const result = await requestPasswordReset(payload.email);
  res.status(200).json({ success: true, data: result });
};

export const confirmPasswordResetHandler = async (req: AuthenticatedRequest, res: Response) => {
  const payload = req.body as ConfirmPasswordResetInput;
  const result = await confirmPasswordReset(payload.token, payload.newPassword);
  res.status(200).json({ success: true, data: result });
};

export const getAccessControlsHandler = async (_req: AuthenticatedRequest, res: Response) => {
  const lists = await listAccessControls();
  res.status(200).json({ success: true, data: lists });
};

export const updateAccessControlsHandler = async (req: AuthenticatedRequest, res: Response) => {
  const lists = await replaceAccessControls(req.body, req.user?.id);
  res.status(200).json({ success: true, data: lists });
};

