import type { Response } from 'express';

import type { AuthenticatedRequest } from '@middlewares/auth.js';

import { listAuditLogs } from './audit.service.js';

export const listAuditLogsHandler = async (req: AuthenticatedRequest, res: Response) => {
  const entries = await listAuditLogs({
    entityType: req.query.entityType?.toString(),
    entityId: req.query.entityId?.toString(),
    performedBy: req.query.performedBy?.toString(),
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  });

  res.status(200).json({
    success: true,
    data: entries,
  });
};

