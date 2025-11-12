import http from 'node:http';

import { env } from '@config/index.js';
import { connectDatabase } from '@core/database.js';
import { initializeStorage } from '@core/storage.js';
import { logger } from '@core/logger.js';
import { createApp } from './app.js';
import { initializeQueue } from '@core/queue.js';
import { initializeRealtime } from '@core/socket.js';

const bootstrap = async () => {
  try {
    await connectDatabase();
    await initializeStorage();
    await initializeQueue();
    const app = createApp();
    const server = http.createServer(app);
    initializeRealtime(server);

    server.listen(env.port, () => {
      logger.info(`Backend server listening on port ${env.port}`);
    });

    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, () => {
        logger.info(`${signal} received. Shutting down gracefully...`);
        server.close(() => {
          logger.info('HTTP server closed');
          process.exit(0);
        });
      });
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to bootstrap application');
    process.exit(1);
  }
};

void bootstrap();

