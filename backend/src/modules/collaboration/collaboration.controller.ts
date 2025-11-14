import type { Response } from 'express';

import type { AuthenticatedRequest } from '@middlewares/auth.js';

import { addComment, listComments, lockDocument, unlockDocument } from './collaboration.service.js';
import { upload } from '@middlewares/upload.js';
import { getFilePublicUrl } from '@core/storage.js';

export const listCommentsHandler = async (req: AuthenticatedRequest, res: Response) => {
  const comments = await listComments(req.params.documentId);
  res.status(200).json({
    success: true,
    data: comments,
  });
};

export const addCommentHandler = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new Error('Authenticated user is required');
  }

  const comment = await addComment({
    documentId: req.params.documentId,
    message: req.body.message,
    mentions: req.body.mentions,
    authorId: user.id,
    authorName: `${req.body.authorName ?? ''}`.trim() || user.id,
    attachments: Array.isArray((req as any).files)
      ? ((req as any).files as Array<Express.Multer.File>).map((f) => ({
          filename: f.originalname,
          storageKey: f.filename,
          mimeType: f.mimetype,
          size: f.size,
          fileUrl: getFilePublicUrl(f.filename),
        }))
      : [],
  });

  res.status(201).json({
    success: true,
    data: comment,
  });
};

export const lockDocumentHandler = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new Error('Authenticated user is required');
  }

  const document = await lockDocument(
    { documentId: req.params.documentId, userId: user.id },
    req.body.force,
  );

  res.status(200).json({
    success: true,
    data: document,
  });
};

export const unlockDocumentHandler = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new Error('Authenticated user is required');
  }

  const document = await unlockDocument({ documentId: req.params.documentId, userId: user.id });

  res.status(200).json({
    success: true,
    data: document,
  });
};

