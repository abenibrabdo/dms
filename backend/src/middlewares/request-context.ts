import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

import { logger } from '@core/logger.js';

export const requestContext = (req: Request, res: Response, next: NextFunction) => {
  const incomingId = req.headers['x-request-id'];
  const requestId = (Array.isArray(incomingId) ? incomingId[0] : incomingId) ?? randomUUID();
  req.requestId = requestId;

  res.setHeader('x-request-id', requestId);

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      {
        requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration,
      },
      'Request completed',
    );
  });

  next();
};

