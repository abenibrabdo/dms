import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();
const parseList = (value, fallback = []) => {
    if (!value)
        return fallback;
    return value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
};
const requiredEnv = (key, defaultValue) => {
    const value = process.env[key] ?? defaultValue;
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};
export const env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '4000', 10),
    database: {
        host: requiredEnv('DB_HOST', '127.0.0.1'),
        port: parseInt(process.env.DB_PORT ?? '3306', 10),
        username: requiredEnv('DB_USER', 'dms'),
        password: requiredEnv('DB_PASSWORD', 'change-me'),
        name: requiredEnv('DB_NAME', 'dms'),
        logging: process.env.DB_LOGGING === 'true',
        sync: process.env.DB_SYNC !== 'false',
    },
    jwtSecret: requiredEnv('JWT_SECRET', 'change-me'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
    refreshSecret: requiredEnv('REFRESH_SECRET', 'change-me-too'),
    refreshExpiresIn: process.env.REFRESH_EXPIRES_IN ?? '7d',
    cryptoSecret: requiredEnv('CRYPTO_SECRET', 'super-secret-key'),
    enablePrettyLogs: process.env.PRETTY_LOGS === 'true',
    uploadDir: path.resolve(process.cwd(), process.env.UPLOAD_DIR ?? 'storage/uploads'),
    storage: {
        provider: (process.env.STORAGE_PROVIDER ?? 'local'),
        s3: {
            region: process.env.S3_REGION ?? 'us-east-1',
            bucket: process.env.S3_BUCKET ?? 'dms-bucket',
            endpoint: process.env.S3_ENDPOINT,
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
            signedUrlExpiresSeconds: Number.parseInt(process.env.S3_SIGNED_URL_EXPIRES ?? '900', 10),
        },
    },
    corsOrigins: parseList(process.env.CORS_ORIGINS, ['*']),
    localization: {
        supportedLocales: parseList(process.env.SUPPORTED_LOCALES, ['en', 'am', 'om']),
        defaultLocale: process.env.DEFAULT_LOCALE ?? 'en',
    },
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
