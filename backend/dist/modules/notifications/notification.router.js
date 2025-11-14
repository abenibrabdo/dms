import { Router } from 'express';
import { authenticate, authorize } from '@middlewares/auth.js';
import { validate } from '@middlewares/validation.js';
import { createNotificationHandler, listNotificationsHandler, markNotificationReadHandler, } from './notification.controller.js';
import { createNotificationSchema } from './notification.schema.js';
const router = Router();
router.use(authenticate);
router
    .route('/')
    .get(listNotificationsHandler)
    .post(authorize(['admin', 'workflow-manager']), validate(createNotificationSchema), createNotificationHandler);
router.post('/:notificationId/read', markNotificationReadHandler);
export const notificationRouter = router;
