import { RealtimeChannels } from '@core/events.js';
import { publishMessage } from '@core/queue.js';
import { broadcastEvent } from '@core/socket.js';
import { recordAuditLog } from '@modules/audit/audit.service.js';

import { NotificationModel } from './notification.model.js';
import type { CreateNotificationInput } from './notification.types.js';

export const createNotification = async (input: CreateNotificationInput) => {
  const notification = await NotificationModel.create(input);
  await recordAuditLog({
    entityType: 'notification',
    entityId: notification.id,
    action: 'notification.created',
    performedBy: 'system',
    metadata: {
      title: input.title,
      type: input.type,
      recipient: input.recipient,
    },
  });
  await publishMessage({
    routingKey: 'notifications.created',
    payload: {
      notificationId: notification.id,
      recipient: notification.recipient,
    },
  });
  broadcastEvent(RealtimeChannels.NOTIFICATION_CREATED, {
    recipient: notification.recipient,
    notificationId: notification.id,
  });
  return notification;
};

export const listNotifications = async (recipient: string) => {
  return NotificationModel.find({ recipient }).sort({ createdAt: -1 }).lean();
};

export const markNotificationAsRead = async (notificationId: string, userId: string) => {
  const notification = await NotificationModel.findByIdAndUpdate(
    notificationId,
    { status: 'read' },
    { new: true },
  ).lean();
  if (notification) {
    await recordAuditLog({
      entityType: 'notification',
      entityId: notificationId,
      action: 'notification.read',
      performedBy: userId,
      metadata: {
        recipient: notification.recipient,
      },
    });
  }
  broadcastEvent(RealtimeChannels.NOTIFICATION_READ, {
    recipient: userId,
    notificationId,
  });
  return notification;
};

