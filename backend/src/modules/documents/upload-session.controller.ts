import type { Response } from 'express';

import type { AuthenticatedRequest } from '@middlewares/auth.js';
import { ValidationError } from '@core/errors.js';

import { initUploadSession, putUploadChunk, finalizeUploadSession, abortUploadSession } from './upload-session.service.js';

export const initUploadSessionHandler = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id ?? req.body.owner?.toString();
  if (!userId) throw new ValidationError('Owner required');
  const result = await initUploadSession({
    title: req.body.title,
    type: req.body.type,
    category: req.body.category,
    owner: req.body.owner,
    department: req.body.department,
    tags: req.body.tags ?? [],
    status: req.body.status,
    filename: req.body.filename,
    mimeType: req.body.mimeType,
    totalSize: req.body.totalSize,
    chunkSize: req.body.chunkSize,
    checksum: req.body.checksum,
    createdBy: userId,
  });
  res.status(201).json({ success: true, data: result });
};

export const putUploadChunkHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId, chunkNumber } = req.params;
  const n = Number.parseInt(chunkNumber, 10);
  if (Number.isNaN(n) || n < 1) throw new ValidationError('Invalid chunk number');
  await putUploadChunk(sessionId, n, req);
  res.status(204).end();
};

export const finalizeUploadSessionHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId } = req.params;
  const userId = req.user?.id ?? 'system';
  const document = await finalizeUploadSession(sessionId, userId, req.body.checksum);
  res.status(201).json({ success: true, data: document });
};

export const abortUploadSessionHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId } = req.params;
  const result = await abortUploadSession(sessionId);
  res.status(200).json({ success: true, data: result });
};

