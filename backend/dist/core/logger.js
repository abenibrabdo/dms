import pino from 'pino';
import { env } from '@config/index.js';
const transport = env.enablePrettyLogs && env.nodeEnv !== 'production'
    ? {
        target: 'pino-pretty',
        options: {
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
        },
    }
    : undefined;
export const logger = pino({
    level: env.nodeEnv === 'production' ? 'info' : 'debug',
}, transport);
