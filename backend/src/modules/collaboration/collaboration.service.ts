import { AuthorizationError, NotFoundError } from '@core/errors.js';
import { logger } from '@core/logger.js';

import { RealtimeChannels } from '@core/events.js';
import { publishMessage } from '@core/queue.js';
import { broadcastEvent } from '@core/socket.js';
import { recordAuditLog } from '@modules/audit/audit.service.js';
import { DocumentModel } from '@modules/documents/document.model.js';

import { CommentModel } from './comment.model.js';
import type { CreateCommentInput, LockDocumentInput } from './collaboration.types.js';

export const addComment = async (input: CreateCommentInput) => {
  const document = await DocumentModel.findById(input.documentId);
  if (!document) {
    throw new NotFoundError('Document not found for comment');
  }

  const comment = await CommentModel.create({
    documentId: input.documentId,
    authorId: input.authorId,
    authorName: input.authorName,
    message: input.message,
    mentions: input.mentions ?? [],
  });

  logger.info(
    { documentId: document.id, commentId: comment.id, authorId: input.authorId },
    'Comment posted on document',
  );
  await recordAuditLog({
    entityType: 'document',
    entityId: document.id,
    action: 'document.comment.added',
    performedBy: input.authorId,
    performedByName: input.authorName,
    metadata: {
      commentId: comment.id,
      mentions: comment.mentions,
    },
  });
  await publishMessage({
    routingKey: 'documents.comment.added',
    payload: {
      documentId: document.id,
      commentId: comment.id,
    },
  });
  broadcastEvent(RealtimeChannels.COMMENT_ADDED, {
    documentId: document.id,
    commentId: comment.id,
  });

  return comment;
};

export const listComments = async (documentId: string) => {
  return CommentModel.find({ documentId }).sort({ createdAt: 1 }).lean();
};

export const lockDocument = async (input: LockDocumentInput, force = false) => {
  const document = await DocumentModel.findById(input.documentId);
  if (!document) {
    throw new NotFoundError('Document not found for locking');
  }

  if (document.isLocked && document.lockOwner !== input.userId && !force) {
    throw new AuthorizationError('Document already locked by another user');
  }

  document.isLocked = true;
  document.lockOwner = input.userId;
  await document.save();

  logger.info({ documentId: document.id, lockOwner: input.userId }, 'Document locked');
  await recordAuditLog({
    entityType: 'document',
    entityId: document.id,
    action: 'document.locked',
    performedBy: input.userId,
    metadata: { force },
  });
  await publishMessage({
    routingKey: 'documents.locked',
    payload: {
      documentId: document.id,
      userId: input.userId,
      force,
    },
  });
  broadcastEvent(RealtimeChannels.DOCUMENT_UPDATED, {
    documentId: document.id,
    event: 'locked',
    userId: input.userId,
  });
  return document;
};

export const unlockDocument = async (input: LockDocumentInput) => {
  const document = await DocumentModel.findById(input.documentId);
  if (!document) {
    throw new NotFoundError('Document not found for unlocking');
  }

  if (document.lockOwner !== input.userId) {
    throw new AuthorizationError('Only lock owner can unlock the document');
  }

  document.isLocked = false;
  document.lockOwner = undefined;
  await document.save();

  logger.info({ documentId: document.id, lockOwner: input.userId }, 'Document unlocked');
  await recordAuditLog({
    entityType: 'document',
    entityId: document.id,
    action: 'document.unlocked',
    performedBy: input.userId,
  });
  await publishMessage({
    routingKey: 'documents.unlocked',
    payload: {
      documentId: document.id,
      userId: input.userId,
    },
  });
  broadcastEvent(RealtimeChannels.DOCUMENT_UPDATED, {
    documentId: document.id,
    event: 'unlocked',
    userId: input.userId,
  });
  return document;
};

