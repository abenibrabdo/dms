import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '@config/index.js';
import { NotFoundError } from './errors.js';
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, } from '@aws-sdk/client-s3';
const ensureDirectory = async (dir) => {
    await fs.mkdir(dir, { recursive: true });
};
export const initializeStorage = async () => {
    if (env.storage.provider === 'local') {
        await ensureDirectory(env.uploadDir);
    }
};
export const getStoragePath = (storageKey) => {
    return path.join(env.uploadDir, storageKey);
};
export const getFilePublicUrl = (storageKey) => {
    if (env.storage.provider === 'local') {
        const safeKey = storageKey.replace(/\\/g, '/');
        return `/uploads/${encodeURIComponent(safeKey)}`;
    }
    return '';
};
export const getFileStream = async (storageKey) => {
    if (env.storage.provider === 'local') {
        const filePath = getStoragePath(storageKey);
        try {
            await fs.access(filePath);
        }
        catch {
            throw new NotFoundError('Stored file not found');
        }
        return createReadStream(filePath);
    }
    const client = createS3Client();
    const command = new GetObjectCommand({ Bucket: env.storage.s3.bucket, Key: storageKey });
    try {
        const result = await client.send(command);
        const body = result.Body;
        if (!body || typeof body.pipe !== 'function') {
            throw new NotFoundError('Stored file not found');
        }
        return body;
    }
    catch {
        throw new NotFoundError('Stored file not found');
    }
};
export const deleteFile = async (storageKey) => {
    if (env.storage.provider === 'local') {
        const filePath = getStoragePath(storageKey);
        try {
            await fs.unlink(filePath);
        }
        catch (error) {
            if (error?.code === 'ENOENT') {
                return;
            }
            throw error;
        }
        return;
    }
    const client = createS3Client();
    const command = new DeleteObjectCommand({ Bucket: env.storage.s3.bucket, Key: storageKey });
    await client.send(command);
};
const createS3Client = () => {
    const cfg = {
        region: env.storage.s3.region,
    };
    if (env.storage.s3.endpoint) {
        cfg.endpoint = env.storage.s3.endpoint;
    }
    if (env.storage.s3.accessKeyId && env.storage.s3.secretAccessKey) {
        cfg.credentials = {
            accessKeyId: env.storage.s3.accessKeyId,
            secretAccessKey: env.storage.s3.secretAccessKey,
        };
    }
    if (env.storage.s3.forcePathStyle) {
        cfg.forcePathStyle = true;
    }
    return new S3Client(cfg);
};
export const persistUploadedFile = async (storageKey) => {
    if (env.storage.provider === 'local')
        return;
    const filePath = getStoragePath(storageKey);
    try {
        await fs.access(filePath);
    }
    catch {
        throw new NotFoundError('Uploaded temp file not found');
    }
    const client = createS3Client();
    const bodyStream = createReadStream(filePath);
    const put = new PutObjectCommand({ Bucket: env.storage.s3.bucket, Key: storageKey, Body: bodyStream });
    await client.send(put);
    await fs.unlink(filePath);
};
