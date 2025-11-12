import type { Response } from 'express';

import type { AuthenticatedRequest } from '@middlewares/auth.js';

import { getSyncSnapshot } from './sync.service.js';
import type { SyncTopic } from './sync.types.js';

export const getSyncSnapshotHandler = async (req: AuthenticatedRequest, res: Response) => {
  const sinceParam = req.query.since?.toString();
  const limit = req.query.limit ? Number.parseInt(req.query.limit.toString(), 10) : undefined;
  const topicsQuery = req.query.topics?.toString();
  const topics = topicsQuery?.split(',').map((topic) => topic.trim()) as SyncTopic[] | undefined;

  const since = sinceParam ? new Date(sinceParam) : undefined;

  const snapshot = await getSyncSnapshot({
    since,
    limit,
    topics,
    userId: req.user?.id,
  });

  res.status(200).json({
    success: true,
    data: snapshot,
  });
};


