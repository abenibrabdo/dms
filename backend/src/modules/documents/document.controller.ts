import type { Response } from 'express';

import { pipeline } from 'node:stream/promises';

import { getFileStream, getFileStat, getStoragePath } from '@core/storage.js';
import { ValidationError } from '@core/errors.js';
import type { AuthenticatedRequest } from '@middlewares/auth.js';

import {
  addDocumentVersion,
  createDocument,
  findDocumentById,
  listDocuments,
  getDocumentVersionMetadata,
  updateDocumentMetadata,
} from './document.service.js';
import type { AddDocumentVersionInput, CreateDocumentInput } from './document.types.js';

const parseTags = (value?: string | string[]) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((tag) => tag.trim().length > 0);
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
};

export const createDocumentHandler = async (req: AuthenticatedRequest, res: Response) => {
  const payload = req.body as CreateDocumentInput;
  const userId = req.user?.id ?? payload.owner;
  const document = await createDocument(payload, userId);

  res.status(201).json({
    success: true,
    data: document,
  });
};

export const listDocumentsHandler = async (_req: AuthenticatedRequest, res: Response) => {
  const documents = await listDocuments();
  res.status(200).json({
    success: true,
    data: documents,
  });
};

export const getDocumentHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { documentId } = req.params;
  const document = await findDocumentById(documentId);
  res.status(200).json({
    success: true,
    data: document,
  });
};

export const updateDocumentHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { documentId } = req.params;
  const document = await updateDocumentMetadata(documentId, req.body, req.user?.id ?? 'system');
  res.status(200).json({
    success: true,
    data: document,
  });
};

export const addDocumentVersionHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { documentId } = req.params;
  const payload = req.body as Omit<AddDocumentVersionInput, 'documentId' | 'createdBy'>;
  const document = await addDocumentVersion({
    ...payload,
    documentId,
    createdBy: req.user?.id ?? 'system',
  });

  res.status(201).json({
    success: true,
    data: document,
  });
};

export const uploadDocumentHandler = async (req: AuthenticatedRequest, res: Response) => {
  const file = req.file;
  if (!file) {
    throw new ValidationError('File is required');
  }

  const title = req.body.title?.toString();
  const type = req.body.type?.toString();
  const owner = req.body.owner?.toString() ?? req.user?.id;

  if (!title || !type) {
    throw new ValidationError('Title and type are required');
  }

  if (!owner) {
    throw new ValidationError('Owner is required');
  }

  const document = await createDocument(
    {
      title,
      type,
      owner,
      category: req.body.category?.toString(),
      department: req.body.department?.toString(),
      tags: parseTags(req.body.tags),
      status: req.body.status?.toString() as CreateDocumentInput['status'],
      filename: file.originalname,
      storageKey: file.filename,
      size: file.size,
      mimeType: file.mimetype,
    },
    req.user?.id ?? owner,
  );


  res.status(201).json({
    success: true,
    data: document,
  });
};

export const uploadDocumentVersionHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { documentId } = req.params;
  const file = req.file;

  if (!file) {
    throw new ValidationError('File is required');
  }

  const document = await addDocumentVersion({
    documentId,
    filename: file.originalname,
    storageKey: file.filename,
    size: file.size,
    mimeType: file.mimetype,
    createdBy: req.user?.id ?? 'system',
  });


  res.status(201).json({
    success: true,
    data: document,
  });
};

export const downloadDocumentHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { documentId } = req.params;
  const { version } = await getDocumentVersionMetadata(documentId);
  const stat = await getFileStat(version.storageKey);
  const range = req.headers.range;
  res.setHeader('Content-Type', version.mimeType ?? 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(version.filename)}"`);
  res.setHeader('Accept-Ranges', 'bytes');
  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    const start = match && match[1] ? parseInt(match[1], 10) : 0;
    const end = match && match[2] ? parseInt(match[2], 10) : stat.size - 1;
    const chunkSize = end - start + 1;
    res.status(206);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`);
    res.setHeader('Content-Length', String(chunkSize));
    const rs = (await import('node:fs')).createReadStream(stat.path, { start, end });
    await pipeline(rs, res);
    return;
  }
  res.setHeader('Content-Length', String(stat.size));
  const stream = await (async () => (await import('node:fs')).createReadStream(stat.path))();
  await pipeline(stream, res);
};

export const downloadDocumentVersionHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { documentId, versionNumber } = req.params;
  const versionNum = Number.parseInt(versionNumber, 10);
  if (Number.isNaN(versionNum)) {
    throw new ValidationError('Version number must be numeric');
  }

  const { version } = await getDocumentVersionMetadata(documentId, versionNum);
  const stat = await getFileStat(version.storageKey);
  const range = req.headers.range;
  res.setHeader('Content-Type', version.mimeType ?? 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(version.filename)}"`);
  res.setHeader('Accept-Ranges', 'bytes');
  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    const start = match && match[1] ? parseInt(match[1], 10) : 0;
    const end = match && match[2] ? parseInt(match[2], 10) : stat.size - 1;
    const chunkSize = end - start + 1;
    res.status(206);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`);
    res.setHeader('Content-Length', String(chunkSize));
    const rs = (await import('node:fs')).createReadStream(stat.path, { start, end });
    await pipeline(rs, res);
    return;
  }
  res.setHeader('Content-Length', String(stat.size));
  const stream = await (async () => (await import('node:fs')).createReadStream(stat.path))();
  await pipeline(stream, res);
};

 

