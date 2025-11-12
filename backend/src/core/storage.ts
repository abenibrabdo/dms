import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import { env } from '@config/index.js';
import { NotFoundError } from './errors.js';

const ensureDirectory = async (dir: string) => {
  await fs.mkdir(dir, { recursive: true });
};

export const initializeStorage = async () => {
  await ensureDirectory(env.uploadDir);
};

export const getStoragePath = (storageKey: string) => {
  return path.join(env.uploadDir, storageKey);
};

export const getFilePublicUrl = (storageKey: string) => {
  const safeKey = storageKey.replace(/\\/g, '/');
  return `/uploads/${encodeURIComponent(safeKey)}`;
};

export const getFileStream = async (storageKey: string) => {
  const filePath = getStoragePath(storageKey);
  try {
    await fs.access(filePath);
  } catch {
    throw new NotFoundError('Stored file not found');
  }
  return createReadStream(filePath);
};

export const deleteFile = async (storageKey: string) => {
  const filePath = getStoragePath(storageKey);
  try {
    await fs.unlink(filePath);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
      return;
    }
    throw error;
  }
};

