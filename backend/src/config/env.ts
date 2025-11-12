import path from 'node:path';

import dotenv from 'dotenv';

dotenv.config();

const parseList = (value?: string, fallback: string[] = []) => {
  if (!value) return fallback;
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const requiredEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '4000', 10),
  mongoUri: requiredEnv('MONGODB_URI', 'mongodb://localhost:27017/dms'),
  jwtSecret: requiredEnv('JWT_SECRET', 'change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  refreshSecret: requiredEnv('REFRESH_SECRET', 'change-me-too'),
  refreshExpiresIn: process.env.REFRESH_EXPIRES_IN ?? '7d',
  cryptoSecret: requiredEnv('CRYPTO_SECRET', 'super-secret-key'),
  enablePrettyLogs: process.env.PRETTY_LOGS === 'true',
  uploadDir: path.resolve(process.cwd(), process.env.UPLOAD_DIR ?? 'storage/uploads'),
  corsOrigins: parseList(process.env.CORS_ORIGINS, ['*']),
  rateLimit: {
    windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '900000', 10), // 15 minutes
    max: Number.parseInt(process.env.RATE_LIMIT_MAX ?? '500', 10),
  },
  adminSeed: {
    email: requiredEnv('ADMIN_SEED_EMAIL', 'admin@dms.local'),
    password: requiredEnv('ADMIN_SEED_PASSWORD', 'ChangeMeNow!'),
    firstName: process.env.ADMIN_SEED_FIRST_NAME ?? 'System',
    lastName: process.env.ADMIN_SEED_LAST_NAME ?? 'Administrator',
    department: process.env.ADMIN_SEED_DEPARTMENT ?? 'IT',
  },
};

export type AppEnv = typeof env;

