import type { Response } from 'express';

import type { AuthenticatedRequest } from '@middlewares/auth.js';

import { getDashboardSummary } from './analytics.service.js';

export const getAnalyticsSummaryHandler = async (_req: AuthenticatedRequest, res: Response) => {
  const summary = await getDashboardSummary();
  res.status(200).json({
    success: true,
    data: summary,
  });
};

