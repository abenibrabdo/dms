import { RealtimeChannels } from '@core/events.js';
import { publishMessage } from '@core/queue.js';
import { broadcastEvent } from '@core/socket.js';
import { recordAuditLog } from '@modules/audit/audit.service.js';
import { NotificationModel } from './notification.model.js';
export const createNotification = async (input) => {
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
    return notification.get({ plain: true });
};
export const listNotifications = async (recipient) => {
    const notifications = await NotificationModel.findAll({
        where: { recipient },
        order: [['createdAt', 'DESC']],
    });
    return notifications.map((item) => item.get({ plain: true }));
};
export const markNotificationAsRead = async (notificationId, userId) => {
    const notification = await NotificationModel.findByPk(notificationId);
    if (notification) {
        notification.status = 'read';
        await notification.save();
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
    return notification?.get({ plain: true }) ?? null;
};
