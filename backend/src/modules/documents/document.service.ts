import { NotFoundError } from '@core/errors.js';
import { logger } from '@core/logger.js';

import { sequelize } from '@core/database.js';
import { RealtimeChannels } from '@core/events.js';
import { publishMessage } from '@core/queue.js';
import { broadcastEvent } from '@core/socket.js';
import { recordAuditLog } from '@modules/audit/audit.service.js';
import { getFilePublicUrl } from '@core/storage.js';

import {
  DocumentModel,
  DocumentVersionModel,
  type ManagedDocument,
  type DocumentMetadata,
  type DocumentVersionAttributes,
} from './document.model.js';
import type {
  AddDocumentVersionInput,
  CreateDocumentInput,
  UpdateDocumentMetadataInput,
} from './document.types.js';

const documentInclude = [
  {
    model: DocumentVersionModel,
    as: 'versions',
  },
];

const toMetadata = (document: DocumentModel): DocumentMetadata => ({
  title: document.title,
  type: document.type,
  category: document.category ?? undefined,
  owner: document.owner,
  department: document.department ?? undefined,
  tags: document.tags ?? [],
  status: document.status,
});

const toVersion = (version: DocumentVersionModel): DocumentVersionAttributes => {
  const plain = version.get({ plain: true }) as DocumentVersionAttributes;
  return plain;
};

export const toManagedDocument = (document: DocumentModel): ManagedDocument => {
  const versionModels =
    document.versions ?? (document.get('versions') as DocumentVersionModel[] | undefined) ?? [];
  const versions = versionModels.map(toVersion);
  return {
    id: document.id,
    metadata: toMetadata(document),
    versions,
    currentVersion: document.currentVersion,
    isLocked: document.isLocked,
    lockOwner: document.lockOwner ?? undefined,
    favoriteBy: document.favoriteBy ?? [],
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
};

export const createDocument = async (
  input: CreateDocumentInput,
  createdBy: string,
): Promise<ManagedDocument> => {
  const documentId = await sequelize.transaction(async (transaction) => {
    const document = await DocumentModel.create(
      {
        title: input.title,
        type: input.type,
        category: input.category,
        owner: input.owner,
        department: input.department,
        tags: input.tags ?? [],
        status: input.status ?? 'draft',
        currentVersion: 1,
      },
      { transaction },
    );

    await DocumentVersionModel.create(
      {
        documentId: document.id,
        versionNumber: 1,
        filename: input.filename,
        storageKey: input.storageKey,
        fileUrl: getFilePublicUrl(input.storageKey),
        mimeType: input.mimeType,
        createdBy,
        checksum: input.checksum,
        size: input.size,
        contentText: (input as any).contentText,
      },
      { transaction },
    );

    logger.info({ documentId: document.id }, 'Document created');
    return document.id;
  });

  const document = await findDocumentById(documentId);

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

export const listDocuments = async (): Promise<ManagedDocument[]> => {
  const documents = await DocumentModel.findAll({
    include: documentInclude,
    order: [
      ['updatedAt', 'DESC'],
      [{ model: DocumentVersionModel, as: 'versions' }, 'versionNumber', 'ASC'],
    ],
  });

  return documents.map(toManagedDocument);
};

export const findDocumentById = async (id: string): Promise<ManagedDocument> => {
  const document = await DocumentModel.findByPk(id, {
    include: documentInclude,
    order: [[{ model: DocumentVersionModel, as: 'versions' }, 'versionNumber', 'ASC']],
  });
  if (!document) {
    throw new NotFoundError('Document not found');
  }
  return toManagedDocument(document);
};

export const updateDocumentMetadata = async (
  id: string,
  input: UpdateDocumentMetadataInput,
  updatedBy: string,
): Promise<ManagedDocument> => {
  const document = await DocumentModel.findByPk(id);
  if (!document) {
    throw new NotFoundError('Document not found');
  }

  if (input.title !== undefined) document.title = input.title;
  if (input.category !== undefined) document.category = input.category;
  if (input.department !== undefined) document.department = input.department;
  if (input.tags !== undefined) document.tags = input.tags;
  if (input.status !== undefined) document.status = input.status;

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

  return findDocumentById(document.id);
};

export const addDocumentVersion = async (input: AddDocumentVersionInput): Promise<ManagedDocument> => {
  const document = await DocumentModel.findByPk(input.documentId);
  if (!document) {
    throw new NotFoundError('Document not found');
  }

  const nextVersion = document.currentVersion + 1;

  await sequelize.transaction(async (transaction) => {
    document.currentVersion = nextVersion;
    await document.save({ transaction });

    await DocumentVersionModel.create(
      {
        documentId: document.id,
        versionNumber: nextVersion,
        filename: input.filename,
        storageKey: input.storageKey,
        fileUrl: getFilePublicUrl(input.storageKey),
        mimeType: input.mimeType,
        createdBy: input.createdBy,
        checksum: input.checksum,
        size: input.size,
        contentText: (input as any).contentText,
      },
      { transaction },
    );
  });

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

  return findDocumentById(document.id);
};

export const getDocumentVersionMetadata = async (documentId: string, versionNumber?: number) => {
  const document = await DocumentModel.findByPk(documentId, {
    include: documentInclude,
    order: [[{ model: DocumentVersionModel, as: 'versions' }, 'versionNumber', 'ASC']],
  });
  if (!document) {
    throw new NotFoundError('Document not found');
  }

  const versions = (document.get('versions') as DocumentVersionModel[] | undefined) ?? [];
  const resolvedVersion =
    versionNumber !== undefined
      ? versions.find((version) => version.versionNumber === versionNumber)
      : versions.find((version) => version.versionNumber === document.currentVersion);

  if (!resolvedVersion) {
    throw new NotFoundError('Document version not found');
  }

  return {
    document: toManagedDocument(document),
    version: toVersion(resolvedVersion),
  };
};

