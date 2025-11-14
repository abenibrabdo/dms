import { createNotification, listNotifications, markNotificationAsRead, } from './notification.service.js';
export const createNotificationHandler = async (req, res) => {
    const payload = req.body;
    const notification = await createNotification(payload);
    res.status(201).json({
        success: true,
        data: notification,
    });
};
export const listNotificationsHandler = async (req, res) => {
    const recipient = req.user?.id ?? req.query.recipient?.toString() ?? '';
    const notifications = await listNotifications(recipient);
    res.status(200).json({
        success: true,
        data: notifications,
    });
};
export const markNotificationReadHandler = async (req, res) => {
    const { notificationId } = req.params;
    const notification = await markNotificationAsRead(notificationId, req.user?.id ?? 'system');
    res.status(200).json({
        success: true,
        data: notification,
    });
};
