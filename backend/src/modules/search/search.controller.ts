import type { Response } from 'express';

import type { AuthenticatedRequest } from '@middlewares/auth.js';

import { searchDocuments } from './search.service.js';

export const searchDocumentsHandler = async (req: AuthenticatedRequest, res: Response) => {
  const results = await searchDocuments({
    q: req.query.q?.toString() ?? '',
    owner: req.query.owner?.toString(),
    type: req.query.type?.toString(),
    status: req.query.status?.toString(),
    limit: req.query.limit ? Number(req.query.limit) : 20,
  });

  res.status(200).json({
    success: true,
    data: results,
  });
};

