import { randomUUID } from 'node:crypto';
import path from 'node:path';
import multer from 'multer';
import { env } from '@config/index.js';
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, env.uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${randomUUID()}${ext}`;
        cb(null, uniqueName);
    },
});
export const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 200, // 200MB
    },
});
