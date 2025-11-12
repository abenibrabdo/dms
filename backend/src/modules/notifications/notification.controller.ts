import type { Response } from 'express';

import type { AuthenticatedRequest } from '@middlewares/auth.js';

import {
  createNotification,
  listNotifications,
  markNotificationAsRead,
} from './notification.service.js';
import type { CreateNotificationInput } from './notification.types.js';

export const createNotificationHandler = async (req: AuthenticatedRequest, res: Response) => {
  const payload = req.body as CreateNotificationInput;
  const notification = await createNotification(payload);

  res.status(201).json({
    success: true,
    data: notification,
  });
};

export const listNotificationsHandler = async (req: AuthenticatedRequest, res: Response) => {
  const recipient = req.user?.id ?? req.query.recipient?.toString() ?? '';
  const notifications = await listNotifications(recipient);

  res.status(200).json({
    success: true,
    data: notifications,
  });
};

export const markNotificationReadHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { notificationId } = req.params;
  const notification = await markNotificationAsRead(notificationId, req.user?.id ?? 'system');

  res.status(200).json({
    success: true,
    data: notification,
  });
};

