import type { Response } from 'express';

import type { AuthenticatedRequest } from '@middlewares/auth.js';

import type { CreateUserInput, LoginInput } from './auth.types.js';
import { authenticateUser, listUsers, registerUser } from './auth.service.js';

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

