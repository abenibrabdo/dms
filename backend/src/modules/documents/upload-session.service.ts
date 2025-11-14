import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

import { env } from '@config/index.js';
import { NotFoundError, ValidationError } from '@core/errors.js';
import { UploadSessionModel } from './upload-session.model.js';
import { createDocument } from './document.service.js';

const TMP_BASE = path.join(env.uploadDir, 'tmp');

const ensureTmpDir = async () => {
  await fs.mkdir(TMP_BASE, { recursive: true });
};

export const initUploadSession = async (input: {
  title: string;
  type: string;
  category?: string;
  owner: string;
  department?: string;
  tags: string[];
  status: 'draft' | 'in-review' | 'approved' | 'archived';
  filename: string;
  mimeType?: string;
  totalSize: number;
  chunkSize: number;
  checksum?: string;
  createdBy: string;
}) => {
  await ensureTmpDir();
  const tempDir = path.join(TMP_BASE, randomUUID());
  await fs.mkdir(tempDir, { recursive: true });
  const session = await UploadSessionModel.create({
    ...input,
    tempDir,
    receivedChunks: [],
  });
  return { id: session.id };
};

export const putUploadChunk = async (sessionId: string, chunkNumber: number, req: NodeJS.ReadableStream) => {
  const session = await UploadSessionModel.findByPk(sessionId);
  if (!session) throw new NotFoundError('Upload session not found');
  const chunkPath = path.join(session.tempDir, `chunk-${chunkNumber}`);
  await new Promise<void>((resolve, reject) => {
    const ws = fssync.createWriteStream(chunkPath);
    req.pipe(ws);
    ws.on('finish', () => resolve());
    ws.on('error', (err) => reject(err));
  });
  const received = new Set(session.receivedChunks ?? []);
  received.add(chunkNumber);
  session.receivedChunks = Array.from(received).sort((a, b) => a - b);
  await session.save();
};

export const finalizeUploadSession = async (sessionId: string, createdBy: string, checksum?: string) => {
  const session = await UploadSessionModel.findByPk(sessionId);
  if (!session) throw new NotFoundError('Upload session not found');
  const totalChunks = Math.ceil(session.totalSize / session.chunkSize);
  if ((session.receivedChunks ?? []).length !== totalChunks) {
    throw new ValidationError('Not all chunks uploaded');
  }
  const ext = path.extname(session.filename);
  const storageKey = `${Date.now()}-${randomUUID()}${ext}`;
  const finalPath = path.join(env.uploadDir, storageKey);
  const ws = fssync.createWriteStream(finalPath);
  for (let i = 1; i <= totalChunks; i++) {
    const chunkPath = path.join(session.tempDir, `chunk-${i}`);
    await new Promise<void>((resolve, reject) => {
      const rs = fssync.createReadStream(chunkPath);
      rs.on('error', reject);
      rs.on('end', resolve);
      rs.pipe(ws, { end: false });
    });
    await fs.unlink(chunkPath).catch(() => {});
  }
  await new Promise<void>((resolve) => ws.end(resolve));
  await fs.rmdir(session.tempDir).catch(() => {});

  const document = await createDocument(
    {
      title: session.title,
      type: session.type,
      category: session.category ?? undefined,
      owner: session.owner,
      department: session.department ?? undefined,
      tags: session.tags ?? [],
      status: session.status,
      filename: session.filename,
      storageKey,
      size: session.totalSize,
      checksum: checksum ?? session.checksum ?? undefined,
      mimeType: session.mimeType ?? undefined,
    },
    createdBy,
  );

  await UploadSessionModel.destroy({ where: { id: session.id } });
  return document;
};

export const abortUploadSession = async (sessionId: string) => {
  const session = await UploadSessionModel.findByPk(sessionId);
  if (!session) return { success: true };
  const totalChunks = Math.ceil(session.totalSize / session.chunkSize);
  for (let i = 1; i <= totalChunks; i++) {
    const chunkPath = path.join(session.tempDir, `chunk-${i}`);
    await fs.unlink(chunkPath).catch(() => {});
  }
  await fs.rmdir(session.tempDir).catch(() => {});
  await UploadSessionModel.destroy({ where: { id: session.id } });
  return { success: true };
};

