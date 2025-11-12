import { Router } from 'express';

import { analyticsRouter } from '@modules/analytics/index.js';
import { auditRouter } from '@modules/audit/index.js';
import { authRouter } from '@modules/auth/index.js';
import { collaborationRouter } from '@modules/collaboration/index.js';
import { documentRouter } from '@modules/documents/index.js';
import { notificationRouter } from '@modules/notifications/index.js';
import { localizationRouter } from '@modules/localization/index.js';
import { searchRouter } from '@modules/search/index.js';
import { workflowRouter } from '@modules/workflows/index.js';
import { syncRouter } from '@modules/sync/index.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/documents', documentRouter);
router.use('/collaboration', collaborationRouter);
router.use('/workflows', workflowRouter);
router.use('/notifications', notificationRouter);
router.use('/search', searchRouter);
router.use('/analytics', analyticsRouter);
router.use('/audit', auditRouter);
router.use('/localization', localizationRouter);
router.use('/sync', syncRouter);

export const apiRouter = router;

