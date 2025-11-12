import { NotFoundError } from '@core/errors.js';
import { logger } from '@core/logger.js';

import { RealtimeChannels } from '@core/events.js';
import { publishMessage } from '@core/queue.js';
import { broadcastEvent } from '@core/socket.js';
import { recordAuditLog } from '@modules/audit/audit.service.js';

import { DocumentModel, type ManagedDocument } from './document.model.js';
import type {
  AddDocumentVersionInput,
  CreateDocumentInput,
  UpdateDocumentMetadataInput,
} from './document.types.js';

export const createDocument = async (
  input: CreateDocumentInput,
  createdBy: string,
): Promise<ManagedDocument> => {
  const document = await DocumentModel.create({
    metadata: {
      title: input.title,
      type: input.type,
      category: input.category,
      owner: input.owner,
      department: input.department,
      tags: input.tags ?? [],
      status: input.status ?? 'draft',
    },
    versions: [
      {
        versionNumber: 1,
        filename: input.filename,
        storageKey: input.storageKey,
        mimeType: input.mimeType,
        createdBy,
        checksum: input.checksum,
        size: input.size,
        createdAt: new Date(),
      },
    ],
    currentVersion: 1,
  });

  logger.info({ documentId: document.id }, 'Document created');
  await recordAuditLog({
    entityType: 'document',
    entityId: document.id,
    action: 'document.created',
    performedBy: createdBy,
    metadata: {
      title: document.metadata.title,
      type: document.metadata.type,
    },
  });
  await publishMessage({
    routingKey: 'documents.created',
    payload: {
      documentId: document.id,
      owner: document.metadata.owner,
    },
  });
  broadcastEvent(RealtimeChannels.DOCUMENT_UPDATED, {
    documentId: document.id,
    event: 'created',
  });
  return document;
};

export const listDocuments = async () => {
  return DocumentModel.find().lean();
};

export const findDocumentById = async (id: string) => {
  const document = await DocumentModel.findById(id);
  if (!document) {
    throw new NotFoundError('Document not found');
  }
  return document;
};

export const updateDocumentMetadata = async (
  id: string,
  input: UpdateDocumentMetadataInput,
  updatedBy: string,
): Promise<ManagedDocument> => {
  const document = await findDocumentById(id);

  if (input.title) document.metadata.title = input.title;
  if (input.category) document.metadata.category = input.category;
  if (input.department) document.metadata.department = input.department;
  if (input.tags) document.metadata.tags = input.tags;
  if (input.status) document.metadata.status = input.status;

  await document.save();
  logger.info({ documentId: document.id }, 'Document metadata updated');
  await recordAuditLog({
    entityType: 'document',
    entityId: document.id,
    action: 'document.updated',
    performedBy: updatedBy,
    metadata: input,
  });
  await publishMessage({
    routingKey: 'documents.metadata.updated',
    payload: {
      documentId: document.id,
      changes: input,
    },
  });
  broadcastEvent(RealtimeChannels.DOCUMENT_UPDATED, {
    documentId: document.id,
    event: 'metadata-updated',
  });

  return document;
};

export const addDocumentVersion = async (input: AddDocumentVersionInput) => {
  const document = await findDocumentById(input.documentId);

  const nextVersion = document.currentVersion + 1;
  document.versions.push({
    versionNumber: nextVersion,
    filename: input.filename,
    storageKey: input.storageKey,
    mimeType: input.mimeType,
    createdAt: new Date(),
    createdBy: input.createdBy,
    checksum: input.checksum,
    size: input.size,
  });
  document.currentVersion = nextVersion;

  await document.save();
  logger.info({ documentId: document.id, version: nextVersion }, 'New document version added');
  await recordAuditLog({
    entityType: 'document',
    entityId: document.id,
    action: 'document.version.added',
    performedBy: input.createdBy,
    metadata: {
      filename: input.filename,
      version: nextVersion,
    },
  });
  await publishMessage({
    routingKey: 'documents.version.added',
    payload: {
      documentId: document.id,
      version: nextVersion,
    },
  });
  broadcastEvent(RealtimeChannels.DOCUMENT_VERSION_ADDED, {
    documentId: document.id,
    version: nextVersion,
  });

  return document;
};

export const getDocumentVersionMetadata = async (documentId: string, versionNumber?: number) => {
  const document = await findDocumentById(documentId);

  const resolvedVersion =
    versionNumber !== undefined
      ? document.versions.find((version) => version.versionNumber === versionNumber)
      : document.versions.find((version) => version.versionNumber === document.currentVersion);

  if (!resolvedVersion) {
    throw new NotFoundError('Document version not found');
  }

  return {
    document,
    version: resolvedVersion,
  };
};

