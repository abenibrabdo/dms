import { Router } from 'express';

import { authenticate } from '@middlewares/auth.js';

import { getAnalyticsSummaryHandler } from './analytics.controller.js';

const router = Router();

router.use(authenticate);

router.get('/summary', getAnalyticsSummaryHandler);

export const analyticsRouter = router;

